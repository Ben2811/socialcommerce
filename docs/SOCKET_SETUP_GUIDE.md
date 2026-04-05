# WebSocket Gateway Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Connection Flow](#connection-flow)
4. [Event Types](#event-types)
5. [Error Handling](#error-handling)
6. [Client Integration](#client-integration)
7. [Server Integration](#server-integration)
8. [Best Practices](#best-practices)
9. [Examples](#examples)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The WebSocket Gateway provides real-time bidirectional communication for the application.

**Technology Stack:**
- NestJS WebSockets
- Socket.IO transport
- JWT authentication
- Centralized error handling

**Key Features:**
- Type-safe event handling
- Automatic error catching
- Real-time user presence
- Bidirectional messaging
- Comprehensive error codes

---

## Architecture

### Component Structure

```
src/modules/gateway/
├── constants/
│   └── ws-error.constants.ts        # Error codes & messages
├── decorators/
│   └── ws-catch.decorators.ts       # Error catching decorator
├── filters/
│   └── ws-exceptons.filter.ts       # Global exception filter
├── guards/
│   └── ws.guard.ts                  # JWT authentication
├── types/
│   ├── message.ts                   # Event definitions
│   └── socket-with-user.ts          # Authenticated socket
├── utils/
│   └── ws-error.handler.ts          # Error handler
├── socket.gateway.ts                # Main gateway
└── gateway.module.ts                # NestJS module
```

### Error Handling Flow

1. Error occurs in handler
2. @WsCatch() decorator catches it
3. WsErrorHandler processes and logs
4. Error sent to client with typed code
5. If unhandled, WsExceptionFilter catches

---

## Connection Flow

### Initial Connection

1. Client connects with JWT token
2. WsGuard validates JWT
3. User data attached to socket
4. User added to connectedUsers map
5. USER_ONLINE event broadcast

### Disconnection

1. Client disconnects
2. User removed from map
3. USER_OFFLINE event broadcast

---

## Event Types

### Client → Server

**SEND_MESSAGE**
```typescript
socket.emit('SEND_MESSAGE', {
  recipientId: string,    // Required
  content: string         // Required, 1-1000 chars
})
```

**CHECK_USER_STATUS**
```typescript
socket.emit('CHECK_USER_STATUS', {
  userId: string          // Required
})
```

### Server → Client

**USER_ONLINE** - User came online
**USER_OFFLINE** - User went offline
**RECEIVE_MESSAGE** - New message received
**SUCCESS** - Operation succeeded
**USER_STATUS** - Status check response
**ERROR** - Error response

---

## Error Handling

### Error s

| Code | Message |
|------|---------|
| UNAUTHORIZED | User not authenticated |
| INVALID_PAYLOAD | Invalid message payload |
| MESSAGE_FAILED | Failed to send message |
| INTERNAL_SERVER_ERROR | Internal server error |
| USER_NOT_FOUND | User not found |
| VALIDATION_ERROR | Validation error |
| INVALID_USER_DATA | Invalid user data |
| CONNECTION_FAILED | Connection failed |

### Error Response

```typescript
{
  event: 'ERROR',
  payload: {
    code: string,     // Standardized error code
    message: string   // User-friendly message
  }
}
```

---

## Client Integration

### Installation

```bash
npm install socket.io-client
```

### Basic Setup

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/ws', {
  auth: { token: localStorage.getItem('token') },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
```

### Event Listeners

```typescript
socket.on('RECEIVE_MESSAGE', (payload) => {
  console.log(`From ${payload.senderUsername}: ${payload.content}`);
});

socket.on('USER_ONLINE', (payload) => {
  console.log(`${payload.username} came online`);
});

socket.on('USER_STATUS', (payload) => {
  console.log(`${payload.username} is ${payload.isOnline ? 'online' : 'offline'}`);
});

socket.on('ERROR', (payload) => {
  console.error(`[${payload.code}] ${payload.message}`);
});
```

### Emitting Events

```typescript
// Send message
socket.emit('SEND_MESSAGE', {
  recipientId: 'user-123',
  content: 'Hello!'
});

// Check status
socket.emit('CHECK_USER_STATUS', {
  userId: 'user-456'
});
```

### React Example

```typescript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function ChatComponent() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/ws', {
      auth: { token: localStorage.getItem('token') }
    });

    newSocket.on('RECEIVE_MESSAGE', (payload) => {
      setMessages(prev => [...prev, payload]);
    });

    newSocket.on('ERROR', (payload) => {
      console.error(payload.message);
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

---

## Server Integration

### Module Setup

```typescript
@Module({
  imports: [JwtModule, ConfigModule, UserModule, MessageModule],
  providers: [SocketGateway, WsGuard, WsExceptionFilter],
  exports: [SocketGateway],
})
export class GatewayModule {}
```

### Using in Services

```typescript
@Injectable()
export class NotificationService {
  constructor(private readonly gateway: SocketGateway) {}

  notifyUser(userId: string, message: string) {
    this.gateway.server
      .to(userId)
      .emit('NOTIFICATION', { message });
  }
}
```

### Custom Handlers

```typescript
@WsCatch()
@UseGuards(WsGuard)
@SubscribeMessage('CUSTOM_EVENT')
async handleCustom(
  @MessageBody() payload: any,
  @ConnectedSocket() client: AuthenticatedSocket,
): Promise<void> {
  const user = client.data.user;
  
  try {
    // Process event
    client.emit('RESPONSE', { success: true });
  } catch (error) {
    WsErrorHandler.handle(error, client, 'handleCustom');
  }
}
```

### Broadcasting

```typescript
// To specific user
this.server.to(userId).emit('EVENT', data);

// To all users
this.server.emit('EVENT', data);

// To all except sender
client.broadcast.emit('EVENT', data);
```

---

## Best Practices

### 1. Error Handling

```typescript
socket.on('ERROR', (payload) => {
  switch (payload.code) {
    case 'UNAUTHORIZED':
      redirectToLogin();
      break;
    case 'VALIDATION_ERROR':
      showValidationError(payload.message);
      break;
    default:
      showError(payload.message);
  }
});
```

### 2. Connection Management

```typescript
socket.on('disconnect', () => {
  updateUIForOffline();
});

socket.on('connect', () => {
  syncData();
});
```

### 3. Input Validation

```typescript
const sendMessage = (recipientId: string, content: string) => {
  if (!recipientId || !content.trim() || content.length > 1000) {
    showError('Invalid message');
    return;
  }
  
  socket.emit('SEND_MESSAGE', { recipientId, content });
};
```

### 4. Type Safety

```typescript
import { ServerMessageEvent } from '@/types';

socket.on(ServerMessageEvent.RECEIVE_MESSAGE, (payload) => {
  // TypeScript knows payload type
});
```

### 5. Cleanup

```typescript
useEffect(() => {
  const socket = io(...);
  return () => socket.disconnect();
}, []);
```

---

## Examples

### Message Flow

```typescript
// 1. Client sends
socket.emit('SEND_MESSAGE', {
  recipientId: 'user-456',
  content: 'Hi!'
});

// 2. Recipient receives
socket.on('RECEIVE_MESSAGE', (payload) => {
  console.log(payload.senderUsername, ':', payload.content);
});

// 3. Sender gets confirmation
socket.on('SUCCESS', (payload) => {
  console.log('Recipient online:', payload.data.isRecipientOnline);
});
```

### Status Checking

```typescript
socket.emit('CHECK_USER_STATUS', { userId: 'user-789' });

socket.on('USER_STATUS', (payload) => {
  if (payload.isOnline) {
    console.log(`${payload.username} is online`);
  } else {
    console.log(`Last seen: ${payload.lastSeen}`);
  }
});
```

### Presence Tracking

```typescript
let onlineUsers = [];

socket.on('USER_ONLINE', (payload) => {
  onlineUsers.push(payload.userId);
  updateUsersList();
});

socket.on('USER_OFFLINE', (payload) => {
  onlineUsers = onlineUsers.filter(id => id !== payload.userId);
  updateUsersList();
});
```

---

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED
```

**Fix:**
- Verify server running on port 3000
- Check URL: http://localhost:3000/ws
- Verify CORS configuration

### Authentication Failed

```
Error: Authentication error
```

**Fix:**
- Refresh JWT token
- Check token in localStorage
- Verify token not expired

### Messages Not Received

**Fix:**
- Check event listener registered
- Verify event name spelling
- Check payload format

### Validation Error

```
[INVALID_PAYLOAD] Invalid message payload
```

**Fix:**
- Verify all required fields present
- Check content length < 1000
- Verify field types

### CORS Issues

```
CORS policy: Cross origin requests not allowed
```

**Fix:**
```typescript
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
```

---

## Configuration

### Environment Variables

```bash
WEBSOCKET_PORT=3000
WEBSOCKET_PATH=/ws
JWT_SECRET=your-secret
```

### Gateway Options

```typescript
@WebSocketGateway({
  path: '/ws',
  namespace: '/',
  cors: {
    origin: '*',
    credentials: true,
  },
})
```

### Client Options

```typescript
const socket = io('http://localhost:3000/ws', {
  auth: { token: 'jwt-token' },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});
```

---

## Performance

### Rate Limiting

Implement on server to prevent abuse:

```typescript
const rateLimits = new Map();

// Check before processing
if (exceedsRateLimit(userId)) {
  WsErrorHandler.sendError(client, WsErrorCode.MESSAGE_FAILED);
  return;
}
```

### Memory Management

```typescript
// Periodically clean map
setInterval(() => {
  this.connectedUsers.forEach((user, userId) => {
    if (!socketExists(userId)) {
      this.connectedUsers.delete(userId);
    }
  });
}, 5 * 60 * 1000);
```

### Database Optimization

- Add indexes on (senderId, recipientId)
- Add index on createdAt
- Optimize message queries

---

## Security

### JWT Validation

All connections validated via WsGuard:

```typescript
@UseGuards(WsGuard)
@SubscribeMessage('EVENT')
async handle(...) {
  // Only authenticated users reach here
}
```

### Payload Validation

All messages validated with Zod schemas

### User Isolation

Each socket bound to authenticated user

### CORS Protection

Configured to restrict origins

---

## Summary

The WebSocket Gateway provides:
- Real-time communication
- Type-safe events
- Centralized error handling
- JWT authentication
- User presence tracking
- Comprehensive error codes

For issues, check server logs for WebSocket Error entries.

---

## Frontend Type Safety & State Management

### Installation

```bash
npm install socket.io-client zustand
```

---

## Type Definitions

### WebSocket Event Types

```typescript
// types/websocket.ts
import { z } from 'zod';

export const ServerMessageEventSchema = z.enum([
  'RECEIVE_MESSAGE',
  'USER_ONLINE',
  'USER_OFFLINE',
  'USER_STATUS',
  'SUCCESS',
  'ERROR',
]);

export type ServerMessageEvent = z.infer<typeof ServerMessageEventSchema>;

export const ClientMessageEventSchema = z.enum([
  'SEND_MESSAGE',
  'CHECK_USER_STATUS',
]);

export type ClientMessageEvent = z.infer<typeof ClientMessageEventSchema>;

// Payload Types
export interface UserPresence {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  messageId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: Date;
}

export interface ErrorPayload {
  code: string;
  message: string;
}

export interface SuccessPayload {
  code: string;
  message: string;
  data: {
    recipientId: string;
    isRecipientOnline: boolean;
  };
}

// Server to Client Messages
export const UserOnlinePayloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
  isOnline: z.literal(true),
});

export const UserOfflinePayloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
  isOnline: z.literal(false),
  lastSeen: z.date(),
});

export const ReceiveMessagePayloadSchema = z.object({
  messageId: z.string(),
  senderId: z.string(),
  senderUsername: z.string(),
  content: z.string(),
  timestamp: z.date(),
});

export const UserStatusPayloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
  isOnline: z.boolean(),
  lastSeen: z.date(),
});

export const SuccessPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    recipientId: z.string(),
    isRecipientOnline: z.boolean(),
  }),
});

export const ErrorPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
});

// Client to Server Messages
export const SendMessagePayloadSchema = z.object({
  recipientId: z.string().min(1),
  content: z.string().min(1).max(1000),
});

export type SendMessagePayload = z.infer<typeof SendMessagePayloadSchema>;

export const CheckUserStatusPayloadSchema = z.object({
  userId: z.string().min(1),
});

export type CheckUserStatusPayload = z.infer<typeof CheckUserStatusPayloadSchema>;
```

---

## Zustand Store Setup

### Main WebSocket Store

```typescript
// store/useWebSocketStore.ts
import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { Message, UserPresence, ErrorPayload } from '@/types/websocket';

interface WebSocketState {
  // Connection
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;

  // User Data
  currentUser: UserPresence | null;
  onlineUsers: Map<string, UserPresence>;

  // Messages
  messages: Map<string, Message[]>;
  messageLoading: string | null;
  messageError: ErrorPayload | null;

  // Status Checks
  userStatuses: Map<string, UserPresence>;
  statusLoading: string | null;

  // Actions
  setSocket: (socket: Socket | null) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setConnectionError: (error: string | null) => void;
  
  setCurrentUser: (user: UserPresence | null) => void;
  addOnlineUser: (user: UserPresence) => void;
  removeOnlineUser: (userId: string) => void;
  
  addMessage: (senderId: string, message: Message) => void;
  getConversation: (userId: string) => Message[];
  setMessageLoading: (userId: string | null) => void;
  setMessageError: (error: ErrorPayload | null) => void;
  clearMessages: () => void;
  
  setUserStatus: (userId: string, status: UserPresence) => void;
  setStatusLoading: (userId: string | null) => void;
  
  reset: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  // Initial State
  socket: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  currentUser: null,
  onlineUsers: new Map(),
  messages: new Map(),
  messageLoading: null,
  messageError: null,
  userStatuses: new Map(),
  statusLoading: null,

  // Connection Actions
  setSocket: (socket) => set({ socket }),
  setConnected: (connected) => set({ isConnected: connected }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  setConnectionError: (error) => set({ connectionError: error }),

  // User Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  addOnlineUser: (user) => {
    const { onlineUsers } = get();
    const updated = new Map(onlineUsers);
    updated.set(user.userId, user);
    set({ onlineUsers: updated });
  },
  removeOnlineUser: (userId) => {
    const { onlineUsers } = set({ onlineUsers: updated });
  },

  // Message Actions
  addMessage: (senderId, message) => {
    const { messages } = get();
    const updated = new Map(messages);
    const conversation = updated.get(senderId) || [];
    conversation.push(message);
    updated.set(senderId, conversation);
    set({ messages: updated });
  },
  getConversation: (userId) => {
    const { messages } = get();
    return messages.get(userId) || [];
  },
  setMessageLoading: (userId) => set({ messageLoading: userId }),
  setMessageError: (error) => set({ messageError: error }),
  clearMessages: () => set({ messages: new Map() }),

  // Status Actions
  setUserStatus: (userId, status) => {
    const { userStatuses } = get();
    const updated = new Map(userStatuses);
    updated.set(userId, status);
    set({ userStatuses: updated });
  },
  setStatusLoading: (userId) => set({ statusLoading: userId }),

  // Reset
  reset: () =>
    set({
      socket: null,
      isConnected: false,
      isConnecting: false,
      connectionError: null,
      currentUser: null,
      onlineUsers: new Map(),
      messages: new Map(),
      messageLoading: null,
      messageError: null,
      userStatuses: new Map(),
      statusLoading: null,
    }),
}));
```

### Hooks for WebSocket Operations

```typescript
// hooks/useWebSocket.ts
import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import {
  ServerMessageEvent,
  Message,
  UserPresence,
  ErrorPayload,
} from '@/types/websocket';

export function useWebSocket() {
  const {
    socket,
    isConnected,
    setSocket,
    setConnected,
    setConnecting,
    setConnectionError,
    setCurrentUser,
    addOnlineUser,
    removeOnlineUser,
    addMessage,
    setMessageError,
    setUserStatus,
  } = useWebSocketStore();

  // Initialize connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isConnected) return;

    setConnecting(true);

    const newSocket = io('http://localhost:3000/ws', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('[WS] Connected');
      setConnected(true);
      setConnecting(false);
      setConnectionError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('[WS] Disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error: Error) => {
      console.error('[WS] Connection error:', error.message);
      setConnectionError(error.message);
    });

    // User Presence Events
    newSocket.on(ServerMessageEvent.USER_ONLINE, (payload: UserPresence) => {
      addOnlineUser(payload);
    });

    newSocket.on(ServerMessageEvent.USER_OFFLINE, (payload: UserPresence) => {
      removeOnlineUser(payload.userId);
    });

    // Messaging Events
    newSocket.on(ServerMessageEvent.RECEIVE_MESSAGE, (payload: Message) => {
      addMessage(payload.senderId, payload);
    });

    newSocket.on(ServerMessageEvent.SUCCESS, (payload: any) => {
      console.log('[WS] Operation successful:', payload);
    });

    newSocket.on(ServerMessageEvent.USER_STATUS, (payload: UserPresence) => {
      setUserStatus(payload.userId, payload);
    });

    // Error Event
    newSocket.on(ServerMessageEvent.ERROR, (payload: ErrorPayload) => {
      console.error(`[WS] Error [${payload.code}]:`, payload.message);
      setMessageError(payload);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [token]);

  // Send Message
  const sendMessage = useCallback(
    (recipientId: string, content: string) => {
      if (!socket || !isConnected) {
        setMessageError({
          code: 'NOT_CONNECTED',
          message: 'Not connected to server',
        });
        return;
      }

      if (!recipientId || !content.trim() || content.length > 1000) {
        setMessageError({
          code: 'INVALID_PAYLOAD',
          message: 'Invalid message',
        });
        return;
      }

      socket.emit('SEND_MESSAGE', { recipientId, content });
    },
    [socket, isConnected, setMessageError],
  );

  // Check User Status
  const checkUserStatus = useCallback(
    (userId: string) => {
      if (!socket || !isConnected) return;
      socket.emit('CHECK_USER_STATUS', { userId });
    },
    [socket, isConnected],
  );

  return {
    isConnected,
    sendMessage,
    checkUserStatus,
  };
}
```

### Custom Message Hook

```typescript
// hooks/useMessages.ts
import { useCallback } from 'react';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import { Message } from '@/types/websocket';

export function useMessages(userId: string) {
  const {
    messages,
    messageLoading,
    messageError,
    addMessage,
    getConversation,
    setMessageLoading,
    setMessageError,
    clearMessages,
  } = useWebSocketStore();

  const sendMessage = useCallback(
    (content: string) => {
      setMessageLoading(userId);
      // Message is added via WebSocket listener
    },
    [userId, setMessageLoading],
  );

  const conversation = getConversation(userId);

  return {
    messages: conversation,
    isLoading: messageLoading === userId,
    error: messageError,
    sendMessage,
    clearMessages,
  };
}
```

### Custom Presence Hook

```typescript
// hooks/usePresence.ts
import { useMemo } from 'react';
import { useWebSocketStore } from '@/store/useWebSocketStore';

export function usePresence() {
  const { onlineUsers, userStatuses } = useWebSocketStore();

  const onlineUsersList = useMemo(
    () => Array.from(onlineUsers.values()),
    [onlineUsers],
  );

  const isUserOnline = useCallback(
    (userId: string) => onlineUsers.has(userId),
    [onlineUsers],
  );

  const getUserStatus = useCallback(
    (userId: string) => userStatuses.get(userId),
    [userStatuses],
  );

  return {
    onlineUsers: onlineUsersList,
    isUserOnline,
    getUserStatus,
    onlineCount: onlineUsers.size,
  };
}
```

---

## React Components with Zustand

### Chat Component Example

```typescript
// components/Chat.tsx
import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useMessages } from '@/hooks/useMessages';
import { usePresence } from '@/hooks/usePresence';

interface ChatProps {
  recipientId: string;
  recipientName: string;
}

export function Chat({ recipientId, recipientName }: ChatProps) {
  const [content, setContent] = useState('');
  const { isConnected, sendMessage } = useWebSocket();
  const { messages, isLoading, error } = useMessages(recipientId);
  const { isUserOnline } = usePresence();

  const handleSendMessage = () => {
    if (!content.trim()) return;
    sendMessage(recipientId, content);
    setContent('');
  };

  if (error) {
    return (
      <div className="error">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <h2>{recipientName}</h2>
        <span className={`status ${isUserOnline(recipientId) ? 'online' : 'offline'}`}>
          {isUserOnline(recipientId) ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.messageId} className="message">
            <strong>{msg.senderUsername}</strong>
            <p>{msg.content}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          disabled={!isConnected || isLoading}
        />
        <button onClick={handleSendMessage} disabled={!isConnected || isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="status-info">
        {!isConnected && <p>Disconnected from server</p>}
        {isConnected && <p>Connected</p>}
      </div>
    </div>
  );
}
```

### Online Users Component

```typescript
// components/OnlineUsers.tsx
import { usePresence } from '@/hooks/usePresence';

export function OnlineUsers() {
  const { onlineUsers, onlineCount } = usePresence();

  return (
    <div className="online-users">
      <h3>Online Users ({onlineCount})</h3>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user.userId} className="user-item online">
            <div className="user-avatar">{user.username[0]}</div>
            <div className="user-info">
              <p>{user.username}</p>
              <span className="status">Online</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Connection Status Component

```typescript
// components/ConnectionStatus.tsx
import { useWebSocketStore } from '@/store/useWebSocketStore';

export function ConnectionStatus() {
  const { isConnected, isConnecting, connectionError } = useWebSocketStore();

  return (
    <div className="connection-status">
      {isConnecting && <p>Connecting...</p>}
      {isConnected && !isConnecting && (
        <p className="connected">✓ Connected</p>
      )}
      {!isConnected && !isConnecting && (
        <p className="disconnected">✗ Disconnected</p>
      )}
      {connectionError && (
        <p className="error">{connectionError}</p>
      )}
    </div>
  );
}
```

---

## State Management Best Practices

### 1. Separate Concerns

```typescript
// ✅ Good: Separate stores for different concerns
const useWebSocketStore = create(...); // Connection & presence
const useChatStore = create(...);      // Chat state
const useNotificationStore = create(...); // Notifications
```

### 2. Use Selectors

```typescript
// ✅ Good: Use selectors to avoid unnecessary re-renders
const isConnected = useWebSocketStore((state) => state.isConnected);
const onlineUsers = useWebSocketStore((state) => state.onlineUsers);

// ❌ Bad: Subscribes to entire store
const store = useWebSocketStore();
```

### 3. Memoize Computations

```typescript
// ✅ Good: Memoize expensive operations
const onlineUsersList = useMemo(
  () => Array.from(onlineUsers.values()),
  [onlineUsers],
);
```

### 4. Type Safety

```typescript
// ✅ Good: Full type coverage
interface WebSocketState {
  socket: Socket | null;
  isConnected: boolean;
  // ... all properties typed
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  // TypeScript enforces all properties
}));
```

### 5. Error Boundaries

```typescript
// ✅ Good: Wrap components with error boundary
import { ErrorBoundary } from 'react-error-boundary';

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Chat recipientId="user-123" />
    </ErrorBoundary>
  );
}
```

---

## Advanced Patterns

### Optimistic Updates

```typescript
// hooks/useOptimisticMessage.ts
export function useOptimisticMessage(recipientId: string) {
  const { addMessage, messages } = useWebSocketStore();
  const { sendMessage } = useWebSocket();

  const sendOptimistic = useCallback(
    (content: string) => {
      // Immediately add to UI
      const tempMessage: Message = {
        messageId: `temp-${Date.now()}`,
        senderId: 'me',
        senderUsername: 'You',
        content,
        timestamp: new Date(),
      };

      addMessage(recipientId, tempMessage);

      // Send to server
      sendMessage(recipientId, content);

      // Server will replace temp message with real one
    },
    [recipientId, addMessage, sendMessage],
  );

  return { sendOptimistic, messages: messages.get(recipientId) || [] };
}
```

### Batched Updates

```typescript
// Zustand automatically batches updates
store.setState({
  isConnected: true,
  currentUser: user,
  onlineUsers: new Map(onlineUsers),
  // All updates in single batch
});
```

### Devtools Integration

```typescript
// store/useWebSocketStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    (set) => ({
      // ... state
    }),
    { name: 'WebSocketStore' },
  ),
);
```

---

## Performance Optimization

### 1. Reduce Re-renders with Selectors

```typescript
// components/UserItem.tsx
interface UserItemProps {
  userId: string;
}

export function UserItem({ userId }: UserItemProps) {
  // Only subscribe to this specific user
  const isOnline = useWebSocketStore(
    (state) => state.onlineUsers.get(userId)?.isOnline ?? false,
  );

  return <div>{isOnline ? '🟢' : '🔴'}</div>;
}
```

### 2. Virtualize Long Lists

```typescript
// components/MessageList.tsx
import { FixedSizeList } from 'react-window';

export function MessageList({ messages }: { messages: Message[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {messages[index].content}
    </div>
  );

  return <FixedSizeList height={600} itemCount={messages.length} Row={Row} />;
}
```

### 3. Lazy Load Messages

```typescript
// hooks/useInfiniteMessages.ts
export function useInfiniteMessages(userId: string) {
  const [page, setPage] = useState(0);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const loadMore = useCallback(async () => {
    const messages = await fetchMessages(userId, page);
    setAllMessages((prev) => [...messages, ...prev]);
    setPage((p) => p + 1);
  }, [userId, page]);

  return { messages: allMessages, loadMore };
}
```

---

## Testing with Zustand

### Store Testing

```typescript
// __tests__/useWebSocketStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useWebSocketStore } from '@/store/useWebSocketStore';

describe('useWebSocketStore', () => {
  beforeEach(() => {
    useWebSocketStore.getState().reset();
  });

  it('should add online user', () => {
    const { result } = renderHook(() => useWebSocketStore());

    act(() => {
      result.current.addOnlineUser({
        userId: 'user-1',
        username: 'John',
        isOnline: true,
      });
    });

    expect(result.current.onlineUsers.has('user-1')).toBe(true);
  });

  it('should add message to conversation', () => {
    const { result } = renderHook(() => useWebSocketStore());

    act(() => {
      result.current.addMessage('user-1', {
        messageId: 'msg-1',
        senderId: 'user-1',
        senderUsername: 'John',
        content: 'Hello',
        timestamp: new Date(),
      });
    });

    const conversation = result.current.getConversation('user-1');
    expect(conversation).toHaveLength(1);
  });
});
```

### Hook Testing

```typescript
// __tests__/useMessages.test.ts
import { renderHook, act } from '@testing-library/react';
import { useMessages } from '@/hooks/useMessages';

describe('useMessages', () => {
  it('should return conversation for user', () => {
    const { result } = renderHook(() => useMessages('user-1'));

    expect(Array.isArray(result.current.messages)).toBe(true);
  });

  it('should send message', () => {
    const { result } = renderHook(() => useMessages('user-1'));

    act(() => {
      result.current.sendMessage('Hello');
    });

    expect(result.current.isLoading).toBe(true);
  });
});
```

---

## Summary

**Frontend Stack:**
- ✅ Type-safe with Zod
- ✅ State management with Zustand
- ✅ Custom hooks for WebSocket
- ✅ React components integration
- ✅ Performance optimizations
- ✅ Testing utilities

**Key Benefits:**
- Centralized state management
- Type-safe operations
- Minimal re-renders
- Easy to test
- Scalable architecture


---

## Environment Configuration

### Frontend Environment Variables

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000/ws
VITE_JWT_STORAGE_KEY=auth_token
VITE_LOG_LEVEL=debug
```

### Environment Setup

```typescript
// config/websocket.ts
export const wsConfig = {
  url: import.meta.env.VITE_WS_URL || 'http://localhost:3000/ws',
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
};

export const getAuthToken = () => {
  return localStorage.getItem(
    import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token'
  );
};
```

---

## Common Pitfalls & Solutions

### 1. Memory Leaks from Unclosed Sockets

**Problem:** Socket connections not properly closed

**Solution:**
```typescript
useEffect(() => {
  const socket = io(wsConfig.url);
  return () => socket.disconnect(); // Always cleanup
}, []);
```

### 2. Race Conditions in Message Ordering

**Problem:** Messages arrive out of order

**Solution:**
```typescript
// Use timestamps for ordering
const sortedMessages = messages.sort(
  (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
);
```

### 3. Stale Tokens

**Problem:** Expired JWT token causes disconnection

**Solution:**
```typescript
// Refresh token before expiration
const checkTokenExpiration = () => {
  const token = localStorage.getItem('auth_token');
  const decoded = jwtDecode(token);
  
  const expiresIn = (decoded.exp * 1000 - Date.now()) / 1000;
  
  if (expiresIn < 5 * 60) { // 5 minutes
    refreshToken();
  }
};

setInterval(checkTokenExpiration, 60000); // Check every minute
```

### 4. Duplicate Messages

**Problem:** Receiving same message multiple times

**Solution:**
```typescript
// De-duplicate by messageId
const addMessageSafe = (senderId: string, message: Message) => {
  const conversation = messages.get(senderId) || [];
  
  if (conversation.some(m => m.messageId === message.messageId)) {
    return; // Already exists
  }
  
  addMessage(senderId, message);
};
```

### 5. State Desynchronization

**Problem:** Client state out of sync with server

**Solution:**
```typescript
// Periodic sync on reconnection
socket.on('connect', () => {
  // Resync all user statuses
  Object.keys(userStatuses).forEach(userId => {
    socket.emit('CHECK_USER_STATUS', { userId });
  });
});
```

---

## Real-World Scenarios

### Scenario 1: Chat Application

```typescript
// Full chat flow with notifications
export function useChatApp() {
  const { sendMessage, isConnected } = useWebSocket();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
    // Clear unread notifications
    clearNotifications(userId);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedUser) return;
    sendMessage(selectedUser, content);
  };

  return {
    selectedUser,
    onSelectUser: handleSelectUser,
    onSendMessage: handleSendMessage,
    isConnected,
  };
}
```

### Scenario 2: Real-time Notifications

```typescript
// Notification integration
export function useNotifications() {
  const { socket } = useWebSocketStore();

  useEffect(() => {
    socket?.on('ERROR', (error: ErrorPayload) => {
      showNotification({
        type: 'error',
        title: 'Error',
        message: error.message,
      });
    });

    socket?.on('SUCCESS', (payload: any) => {
      showNotification({
        type: 'success',
        title: 'Success',
        message: payload.message,
      });
    });

    return () => {
      socket?.off('ERROR');
      socket?.off('SUCCESS');
    };
  }, [socket]);
}
```

### Scenario 3: Multi-Room Messaging

```typescript
// Extended for multiple chat rooms
interface ExtendedWebSocketState extends WebSocketState {
  currentRoom: string | null;
  rooms: Map<string, Message[]>;
  setCurrentRoom: (roomId: string) => void;
  addMessageToRoom: (roomId: string, message: Message) => void;
}

export const useExtendedWebSocketStore = create<ExtendedWebSocketState>(
  (set, get) => ({
    ...useWebSocketStore.getState(),
    currentRoom: null,
    rooms: new Map(),

    setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
    addMessageToRoom: (roomId, message) => {
      const { rooms } = get();
      const updated = new Map(rooms);
      const roomMessages = updated.get(roomId) || [];
      roomMessages.push(message);
      updated.set(roomId, roomMessages);
      set({ rooms: updated });
    },
  }),
);
```

---

## API Integration Patterns

### Integrating with REST API

```typescript
// services/messageService.ts
import axios from 'axios';

export const messageService = {
  // Fetch old messages from REST API
  async getHistoryBefore(
    conversationId: string,
    beforeTimestamp: Date,
    limit: number = 50
  ) {
    const response = await axios.get(
      `/api/messages/${conversationId}`,
      {
        params: {
          before: beforeTimestamp.toISOString(),
          limit,
        },
      }
    );
    return response.data;
  },

  // Fallback to REST if WebSocket fails
  async sendMessageFallback(
    recipientId: string,
    content: string
  ) {
    return axios.post('/api/messages', {
      recipientId,
      content,
    });
  },
};

// Hook combining both
export function useMessageService(recipientId: string) {
  const { sendMessage, isConnected } = useWebSocket();
  const { messages, addMessage } = useWebSocketStore();

  const send = async (content: string) => {
    try {
      if (isConnected) {
        sendMessage(recipientId, content);
      } else {
        // Fallback to REST
        const result = await messageService.sendMessageFallback(
          recipientId,
          content
        );
        addMessage(recipientId, result);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  return { send, messages };
}
```

### Hybrid WebSocket + REST Approach

```typescript
// hooks/useHybridMessaging.ts
export function useHybridMessaging(recipientId: string) {
  const { sendMessage, isConnected } = useWebSocket();
  const [unsentMessages, setUnsentMessages] = useState<Message[]>([]);

  // Store unsent messages locally
  const queueMessage = (content: string) => {
    const tempMessage: Message = {
      messageId: `unsent-${Date.now()}`,
      senderId: 'me',
      senderUsername: 'You',
      content,
      timestamp: new Date(),
    };
    setUnsentMessages(prev => [...prev, tempMessage]);
  };

  // Send via WebSocket if available, else queue
  const sendOptimal = (content: string) => {
    if (isConnected) {
      sendMessage(recipientId, content);
    } else {
      queueMessage(content);
    }
  };

  // When connection restored, send queued messages
  useEffect(() => {
    if (isConnected && unsentMessages.length > 0) {
      unsentMessages.forEach(msg => {
        sendMessage(recipientId, msg.content);
      });
      setUnsentMessages([]);
    }
  }, [isConnected]);

  return { sendOptimal, unsentMessages };
}
```

---

## Monitoring & Debugging

### Browser DevTools Setup

```typescript
// Enable Zustand DevTools
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    persist(
      (set) => ({
        // ... store implementation
      }),
      { name: 'WebSocketStore' }
    ),
    { name: 'WebSocketStore' }
  )
);
```

### Production Logging

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (import.meta.env.VITE_LOG_LEVEL !== 'silent') {
      console.log(`[INFO] ${message}`, data);
    }
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to error tracking service
    if (error) {
      reportError(error, { context: message });
    }
  },

  debug: (message: string, data?: any) => {
    if (import.meta.env.VITE_LOG_LEVEL === 'debug') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};

// Usage
logger.error('Failed to send message', error);
logger.info('Message sent', { recipientId });
```

### WebSocket Connection Monitoring

```typescript
// hooks/useConnectionMonitor.ts
export function useConnectionMonitor() {
  const { socket, isConnected, isConnecting } = useWebSocketStore();

  useEffect(() => {
    const stats = {
      connects: 0,
      disconnects: 0,
      errors: 0,
      lastError: null as string | null,
    };

    socket?.on('connect', () => {
      stats.connects++;
      logger.info('Connected', stats);
    });

    socket?.on('disconnect', () => {
      stats.disconnects++;
      logger.info('Disconnected', stats);
    });

    socket?.on('error', (error: any) => {
      stats.errors++;
      stats.lastError = error.message;
      logger.error('Socket error', error);
    });

    // Report stats periodically
    const interval = setInterval(() => {
      logger.debug('Connection stats', stats);
    }, 60000);

    return () => {
      clearInterval(interval);
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('error');
    };
  }, [socket]);
}
```

### Error Tracking Integration

```typescript
// services/errorTracking.ts
import * as Sentry from '@sentry/react';

export function initErrorTracking() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
    });
  }
}

export function reportError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, { contexts: { websocket: context } });
}
```

---

## Deployment Considerations

### Production WebSocket URL

```typescript
// config/websocket.ts
export const getWsUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (import.meta.env.PROD) {
    // Use same domain in production
    return `${window.location.protocol.replace('http', 'ws')}//${window.location.host}/ws`;
  }
  
  return import.meta.env.VITE_WS_URL || 'http://localhost:3000/ws';
};
```

### Load Balancing with Socket.IO

```typescript
// Configure for load balanced servers
const socket = io(wsConfig.url, {
  auth: { token },
  // Sticky sessions or use Redis adapter
  transports: ['websocket'], // Prefer WebSocket
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: Infinity,
});
```

### Redis Adapter for Scaling

```bash
# Server setup with redis adapter
npm install socket.io-redis
```

```typescript
// server/main.ts
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient();
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

---

## Migration Guide

### From Redux to Zustand

```typescript
// Before: Redux
const messageSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
  },
});

const dispatch = useDispatch();
dispatch(addMessage(newMessage));

// After: Zustand
const useMessageStore = create((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
}));

const addMessage = useMessageStore((state) => state.addMessage);
addMessage(newMessage);
```

### From Context API to Zustand

```typescript
// Before: Context
const WebSocketContext = createContext();

function WebSocketProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WebSocketContext.Provider value={[state, dispatch]}>
      {children}
    </WebSocketContext.Provider>
  );
}

// After: Zustand (No provider needed!)
export const useWebSocketStore = create(...);

// Usage is simpler:
const { isConnected } = useWebSocketStore();
```

---

## File Structure Recommendation

```
src/
├── components/
│   ├── Chat/
│   │   ├── Chat.tsx
│   │   ├── MessageList.tsx
│   │   ├── InputArea.tsx
│   │   └── Chat.module.css
│   ├── UserList/
│   │   ├── OnlineUsers.tsx
│   │   └── UserItem.tsx
│   └── ConnectionStatus/
│       └── ConnectionStatus.tsx
├── hooks/
│   ├── useWebSocket.ts
│   ├── useMessages.ts
│   ├── usePresence.ts
│   ├── useOptimisticMessage.ts
│   └── useConnectionMonitor.ts
├── store/
│   └── useWebSocketStore.ts
├── services/
│   ├── websocket.ts
│   ├── messageService.ts
│   └── errorTracking.ts
├── types/
│   └── websocket.ts
├── config/
│   └── websocket.ts
├── utils/
│   ├── logger.ts
│   └── validators.ts
└── App.tsx
```

---

## Checklist for Production

- [ ] Environment variables configured
- [ ] WebSocket connection retry logic implemented
- [ ] Error boundaries in place
- [ ] DevTools installed (Zustand + Socket.IO)
- [ ] Error tracking (Sentry) configured
- [ ] Logging strategy implemented
- [ ] Token refresh before expiry
- [ ] Memory leak prevention (cleanup)
- [ ] Type safety verified
- [ ] Tests written and passing
- [ ] Performance profiled
- [ ] CORS properly configured
- [ ] SSL/TLS for WSS in production
- [ ] Load balancing configured
- [ ] Monitoring alerts set up

---

## Troubleshooting Checklist

**Connection Issues:**
- [ ] Check WebSocket URL in config
- [ ] Verify server is running
- [ ] Check browser console for errors
- [ ] Verify CORS configuration
- [ ] Check network tab in DevTools

**Authentication Issues:**
- [ ] Verify JWT token is present
- [ ] Check token expiration
- [ ] Verify token format
- [ ] Check server logs for auth errors
- [ ] Try refreshing token

**Message Issues:**
- [ ] Check message payload format
- [ ] Verify content length < 1000
- [ ] Check recipient ID is valid
- [ ] Verify both users are connected
- [ ] Check server logs for processing errors

**Performance Issues:**
- [ ] Check number of connected users
- [ ] Monitor memory usage
- [ ] Check for memory leaks
- [ ] Profile React components
- [ ] Analyze WebSocket message frequency

---

## Quick Reference

**Core Hooks:**
```typescript
const { isConnected, sendMessage, checkUserStatus } = useWebSocket();
const { messages, sendMessage, clearMessages } = useMessages(userId);
const { onlineUsers, isUserOnline } = usePresence();
```

**Store Access:**
```typescript
const isConnected = useWebSocketStore(state => state.isConnected);
const messages = useWebSocketStore(state => state.messages);
const onlineUsers = useWebSocketStore(state => state.onlineUsers);
```

**Emitting Events:**
```typescript
socket.emit('SEND_MESSAGE', { recipientId, content });
socket.emit('CHECK_USER_STATUS', { userId });
```

**Listening to Events:**
```typescript
socket.on('RECEIVE_MESSAGE', handleMessage);
socket.on('USER_ONLINE', handleUserOnline);
socket.on('ERROR', handleError);
```

---

## Resources

- [Socket.IO Documentation](https://socket.io/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Socket.IO DevTools](https://chrome.google.com/webstore/detail/socketio-devtools)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)

---

## Final Notes

This comprehensive guide covers:

✅ **Backend Setup** - NestJS gateway with centralized error handling
✅ **Frontend Setup** - React with Zustand state management
✅ **Type Safety** - Full TypeScript + Zod validation
✅ **Best Practices** - Production-ready patterns
✅ **Performance** - Optimization techniques
✅ **Testing** - Unit and integration tests
✅ **Deployment** - Production considerations
✅ **Monitoring** - Logging and debugging
✅ **Troubleshooting** - Common issues and solutions

For questions or issues, refer to the appropriate sections above or check the server/client logs.

**Last Updated:** 2024
**Version:** 1.0