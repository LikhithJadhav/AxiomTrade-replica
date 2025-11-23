// src/components/ErrorBoundary.tsx
"use client";
import React from "react";

type Props = { children: React.ReactNode };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-900 text-white rounded">Something went wrong. Try reloading.</div>;
    }
    return this.props.children;
  }
}
