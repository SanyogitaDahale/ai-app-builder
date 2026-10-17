"use client";
import { Badge } from "@/components/ui/badge";
import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import { BlueTitle, GrayTitle } from "@/components/animate-ui/reusables";
import { cn } from "cn";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { PLACEHOLDERS } from "@/lib/data";

export default function Home() {
  const { isSignedIn } = useAuth(); // desides if yours signed in or not .
  const router = useRouter(); // help us to go to another route.
  const textareaRef = useRef<HTMLTextAreaElement>(null); // for getting reference to perticlar tag.

  // states are client side hook
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused || prompt) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isFocused, prompt]);

  const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  // Submit on Enter, allow Shift + Enter for newlines
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-white/20">
      <section className="relative flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center">
        <HoleBackground
          strokeColor="rgba(255,255,255,0.05)"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />

        <Badge
          variant={"outline"}
          className="relative z-10 gap-2 p-4 backdrop-blur-sm"
        >
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Powered by Gemini 3.6 Flash
        </Badge>

        <h1 className="mx-auto max-w-3xl text-balance font-serif text-5xl leading-tight tracking-tight sm:text-5xl lg:text-7xl z-10">
          <GrayTitle>Bring Your Ideas to</GrayTitle>
          <br />
          <BlueTitle>Life with One Prompt.</BlueTitle>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/40 z-10">
          Describe what you want to build. AI writes the code, picks the
          packages, and renders a live preview all inside your browser.
        </p>

        {/* prompt Box  */}
        <div className="relative z-10 mx-auto mt-12 w-full max-w-2xl">
          <div
            className={cn(
              "flex items-end gap-3 rounded-2xl border bg-[#111111]/90 p-2 backdrop-blur-xl duration-200",
              isFocused
                ? "border-white/20 ring-1 ring-white/8"
                : "border-white/8",
            )}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="min-h-12 w-full resize-none bg-transparent px-3 py-3 text-left text-sm text-white placeholder:text-white/40 focus:outline-none sm:text-base"
              placeholder={PLACEHOLDERS[placeholderIndex]}
              aria-label="Describe the app you want to build"
              style={{ maxHeight: 200 }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
