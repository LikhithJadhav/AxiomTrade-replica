// src/hooks/useSocketClient.ts
import { useEffect, useMemo } from "react";
import { SocketClient } from "../lib/websocket";

export function useSocketClient(socketUrl = "wss://example.local/mock") {
  const client = useMemo(() => new SocketClient(socketUrl), [socketUrl]);
  useEffect(() => {
    client.connect();
    return () => {
      client.disconnect();
    };
  }, [client]);
  return client;
}
