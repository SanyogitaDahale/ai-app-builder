"use client";

import { useEffect, useRef, useState } from "react";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import { Code2, Eye } from "lucide-react";
import type { FileData } from "@/types/workspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const PLACEHOLDER_FILES = {
  "/App.js": {
    code: `export default function App() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0a0a", color: "#f5f5f5", fontFamily: "system-ui, sans-serif" }}>
      Your app preview will appear here
    </main>
  );
}`,
  },
};

type ActiveTab = "code" | "preview";

function SandpackInner({
  fileData,
  activeTab,
  setActiveTab,
}: {
  fileData: FileData | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}) {
  const { sandpack } = useSandpack();
  const previousFiles = useRef<Record<string, { code: string }>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!fileData?.files) return;

    for (const [path, { code }] of Object.entries(fileData.files)) {
      if (previousFiles.current[path]?.code !== code) {
        sandpack.updateFile(path, code);
      }
    }

    previousFiles.current = fileData.files;
  }, [fileData?.files, sandpack]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as ActiveTab)}
      className="flex h-full min-h-0 flex-col gap-0 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-white/6 px-2">
        <TabsList
          variant="line"
          className="h-auto gap-0 rounded-none bg-transparent p-0"
        >
          <TabsTrigger
            value="code"
            className="h-auto gap-2 rounded-none border-b-2 border-transparent px-2 py-2 text-xs text-white/60 data-active:border-white/70 data-active:bg-transparent data-active:text-white"
          >
            <Code2 className="h-3.5 w-3.5" />
            Code
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="h-auto gap-2 rounded-none border-b-2 border-transparent px-2 py-2 text-xs text-white/60 data-active:border-white/70 data-active:bg-transparent data-active:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* TODO  */}
      </div>

      <div className="relative flex-1 overflow-hidden">
        {/* TODO : Loading Overlay  */}

        <SandpackLayout
          style={{
            height: "100vh",
            border: "none",
            borderRadius: 0,
            background: "transparent",
          }}
        >
          <TabsContent value="preview" keepMounted className="mt-0 h-full w-full">
            {isMounted ? (
              <SandpackPreview
                style={{ height: "89%" }}
                showOpenInCodeSandbox={false}
              />
            ) : (
              <div aria-hidden="true" style={{ height: "89%" }} />
            )}
          </TabsContent>

          <TabsContent value="code" keepMounted className="mt-0 flex h-full w-full">
            <SandpackFileExplorer
              style={{
                height: "90%",
                width: "180px",
                borderRight : "0.5px solid rgba(255, 255, 255, 0.08)",
              }}
            />
            <SandpackCodeEditor
              style={{ height: "90%", flex: 1 }}
              showTabs
              showLineNumbers
              showInlineErrors
              closableTabs
              readOnly
            />
          </TabsContent>
        </SandpackLayout>
      </div>
    </Tabs>
  );
}

export function CodePanel({ fileData }: { fileData: FileData | null }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("preview");
  const files = fileData?.files ?? PLACEHOLDER_FILES;
  const filePathKey = Object.keys(files).sort().join("|");

  return (
    <div className="h-full min-h-0 min-w-0 flex-1 bg-[#0a0a0a]">
      <SandpackProvider
        key={filePathKey}
        template="react"
        theme={dracula}
        files={files}
        customSetup={{ dependencies: fileData?.dependencies ?? {} }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          recompileMode: "delayed",
          recompileDelay: 500,
        }}
      >
        <SandpackInner
          fileData={fileData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </SandpackProvider>
    </div>
  );
}
