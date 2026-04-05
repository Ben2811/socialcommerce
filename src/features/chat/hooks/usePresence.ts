"use client";
import { useCallback, useMemo } from "react";
import { useWebSocketStore } from "../stores/chatStore";

export function usePresence() {
  const { onlineUsers, userStatuses } = useWebSocketStore();

  const onlineUsersList = useMemo(
    () => Array.from(onlineUsers.values()),
    [onlineUsers]
  );

  const isUserOnline = useCallback(
    (userId: string) => onlineUsers.has(userId),
    [onlineUsers]
  );

  const getUserStatus = useCallback(
    (userId: string) => userStatuses.get(userId),
    [userStatuses]
  );

  return {
    onlineUsers: onlineUsersList,
    onlineCount: onlineUsers.size,
    isUserOnline,
    getUserStatus,
  };
}