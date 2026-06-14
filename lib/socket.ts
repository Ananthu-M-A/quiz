"use client";

import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:3000";
  }
  
  // Use the current origin for production
  const origin = window.location.origin;
  return origin;
};

export const socket = io(
  getSocketUrl(),
  {
    autoConnect: false
  }
);