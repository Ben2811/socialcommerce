"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { getAuthToken } from "@/actions/auth/getToken";
import { useWebSocketStore } from "../stores/chatStore";
import {
  ServerEvents,
  UserOnlinePayloadSchema,
  UserOfflinePayloadSchema,
  ReceiveMessagePayloadSchema,
  UserStatusPayloadSchema,
  ErrorPayloadSchema,
} from "../types";

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketContext = React.createContext<Socket | null>(null);

export function useSocket() {
  return React.useContext(SocketContext);
}

export function SocketProvider({ children }: SocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const [contextSocket, setContextSocket] = useState<Socket | null>(null);
  const unmountedRef = useRef(false);
  const { user } = useAuth();

  const {
    setSocket,
    setConnected,
    setConnecting,
    setConnectionError,
    addOnlineUser,
    removeOnlineUser,
    addMessage,
    setMessageError,
    setUserStatus,
  } = useWebSocketStore();

  useEffect(() => {
    if (!user) return;

    setConnecting(true);
    unmountedRef.current = false;

    const initSocket = async () => {
      try {
        const token = await getAuthToken();

        if (unmountedRef.current) return;

        if (!token) {
          setConnectionError("Failed to obtain authentication token");
          setConnecting(false);
          return;
        }

        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8080";

        const newSocket = io(serverUrl, {
          path: "/ws",
          auth: { token: `Bearer ${token}` },
          withCredentials: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
          if (unmountedRef.current) return;
          socketRef.current = newSocket;
          setSocket(newSocket);
          setContextSocket(newSocket);
          setConnected(true);
          setConnecting(false);
          setConnectionError(null);
          console.log("[WS] Connected successfully");
        });

        newSocket.on("disconnect", (reason: string) => {
          if (unmountedRef.current) return;
          console.log("[WS] Disconnected. Reason:", reason);
          setConnected(false);
        });

        newSocket.on("connect_error", (error: Error) => {
          if (unmountedRef.current) return;
          console.error("[WS] Connection error:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
          setConnectionError(error.message);
          setConnecting(false);
        });

        newSocket.on("error", (error) => {
          if (unmountedRef.current) return;
          console.error("[WS] Socket error:", error);
        });

        newSocket.on(ServerEvents.USER_ONLINE, (payload: unknown) => {
          if (unmountedRef.current) return;
          const result = UserOnlinePayloadSchema.safeParse(payload);
          if (result.success) addOnlineUser(result.data);
        });

        newSocket.on(ServerEvents.USER_OFFLINE, (payload: unknown) => {
          if (unmountedRef.current) return;
          const result = UserOfflinePayloadSchema.safeParse(payload);
          if (result.success) removeOnlineUser(result.data.userId);
        });

        newSocket.on(ServerEvents.RECEIVE_MESSAGE, (payload: unknown) => {
          if (unmountedRef.current) return;
          const result = ReceiveMessagePayloadSchema.safeParse(payload);
          if (result.success) {
            const message = {
              ...result.data,
              timestamp: result.data.timestamp || result.data.createdAt || new Date(),
            };
            addMessage(result.data.senderId, message as any); // eslint-disable-line @typescript-eslint/no-explicit-any
          }
        });

        newSocket.on(ServerEvents.USER_STATUS, (payload: unknown) => {
          if (unmountedRef.current) return;
          const result = UserStatusPayloadSchema.safeParse(payload);
          if (result.success) setUserStatus(result.data.userId, result.data);
        });

        newSocket.on(ServerEvents.ERROR, (payload: unknown) => {
          if (unmountedRef.current) return;
          const result = ErrorPayloadSchema.safeParse(payload);
          if (result.success) setMessageError(result.data);
        });
      } catch (error) {
        if (!unmountedRef.current) {
          console.error("[WS] Socket initialization error:", error);
          setConnectionError(
            error instanceof Error ? error.message : "Connection failed"
          );
          setConnecting(false);
        }
      }
    };

    initSocket();

    return () => {
      unmountedRef.current = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [
    user,
    setSocket,
    setConnected,
    setConnecting,
    setConnectionError,
    addOnlineUser,
    removeOnlineUser,
    addMessage,
    setMessageError,
    setUserStatus,
  ]);

  return (
    <SocketContext.Provider value={contextSocket}>
      {children}
    </SocketContext.Provider>
  );
}
