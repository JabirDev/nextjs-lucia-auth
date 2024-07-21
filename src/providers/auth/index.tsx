"use client";

import { Session, User } from "lucia";
import { createContext, PropsWithChildren, useContext } from "react";

interface SessionContext {
  user: User | null;
  session: Session | null;
}

const SessionAuth = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: PropsWithChildren<{ value: SessionContext | null }>) {
  return <SessionAuth.Provider value={value}>{children}</SessionAuth.Provider>;
}

export function useSession() {
  const context = useContext(SessionAuth);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
