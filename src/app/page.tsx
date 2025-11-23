// src/app/page.tsx
"use client";
import React from "react";
import TokenTable from "../components/TokenTable/TokenTable";

export default function Page() {
  return (
    <main>
      {/* <h1 className="text-2xl font-semibold mb-4">Token Discovery — Stage 2</h1> */}
      <TokenTable />
    </main>
  );
}
