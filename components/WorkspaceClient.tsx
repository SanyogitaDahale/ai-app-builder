"use client";

import { CodePanel } from "./CodePanel";

export default function WorkspaceClient() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0a0a0a]">
      <aside
        aria-label="Chat panel"
        className="flex w-[28%] min-w-[160px] shrink-0 items-center justify-center border-r border-white/5 bg-[#0a0a0a]"
      >
        <span className="text-[10px] text-white/20">Chat panel coming soon</span>
      </aside>
      <section className="min-h-0 min-w-0 flex-1">
        <CodePanel fileData={null} />
      </section>
    </div>
  );
}
