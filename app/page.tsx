"use client";
import { Badge } from "@/components/ui/badge";
import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import {
  BlueTitle,
  GrayTitle,
  SectionHeading,
  SectionLabel,
} from "@/components/animate-ui/reusables";
import { cn } from "cn";
import { useEffect, useRef, useState } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FEATURES, PLACEHOLDERS, STEPS, SUGGESTIONS } from "@/lib/data";
import { Button } from "@base-ui/react";
import { ArrowRight, ArrowUp, ChevronRight } from "lucide-react";

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

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

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

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-white/20">

      {/* Hero Section  */}
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
              "overflow-hidden rounded-2xl border bg-[#101010]/95 text-left shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors duration-200",
              isFocused
                ? "border-white/20 ring-1 ring-white/8"
                : "border-white/12",
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
              className="block w-full resize-none bg-transparent px-3.5 py-3 text-left text-sm leading-5 text-white placeholder:text-white/35 focus:outline-none sm:text-sm"
              placeholder={PLACEHOLDERS[placeholderIndex]}
              aria-label="Describe the app you want to build"
              style={{ minHeight: 44, maxHeight: 200 }}
            />
            <div className="flex min-h-9 items-center justify-between gap-3 border-t border-white/[0.06] px-2.5 py-1.5 sm:px-3">
              <span className="text-[10px] leading-4 text-white/30 sm:text-[11px]">
                Press ↵ to generate · Shift+↵ for new line
              </span>

              {isSignedIn ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="inline-flex h-7 min-w-[72px] items-center justify-center whitespace-nowrap rounded-full bg-white px-4 text-[11px] leading-none font-medium text-[#111111]"
                  variant={prompt.trim() ? "default" : "secondary"}
                >
                  Generate
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="inline-flex h-7 min-w-[72px] items-center justify-center whitespace-nowrap rounded-full bg-white px-4 text-[11px] leading-none font-medium text-[#111111]">
                    Generate
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-white/40 hover:border-white/15 hover:bg-white/8 hover:text-white/70"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-white/20">
          {" "}
          No credit card required . 10 free generations on sign up
        </p>
      </section>

      <section
        className="px-4 pb-28 pt-2 sm:px-6 sm:pt-0"
        aria-label="Workspace preview"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0d0d0d] shadow-[0_28px_100px_rgba(0,0,0,0.5)]">
            {/* Browser chrome */}
            <div className="flex h-10 items-center border-b border-white/[0.07] px-3 sm:px-4">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-[#ff5f57]" />
                <span className="size-2 rounded-full bg-[#febc2e]" />
                <span className="size-2 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto -translate-x-4 rounded-md bg-white/[0.045] px-8 py-1 text-[9px] text-white/25 sm:px-12">
                forge.app/workspace
              </div>
            </div>

            <div className="flex min-h-[300px] sm:min-h-[360px]">
              {/* Chat panel */}
              <aside className="flex w-[34%] max-w-[290px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0b0b0b] sm:w-[32%]">
                <div className="flex h-9 items-center border-b border-white/[0.05] px-3 text-[9px] font-medium tracking-wide text-white/35 sm:px-4">
                  CHAT
                </div>
                <div className="flex flex-1 flex-col gap-3 overflow-hidden p-2 sm:gap-3.5 sm:p-3">
                  <div className="ml-auto max-w-[88%] rounded-xl rounded-br-sm border border-blue-400/15 bg-blue-500/20 px-2.5 py-2 text-[8px] leading-[1.55] text-blue-50/90 sm:px-3 sm:text-[9px]">
                    Build a kanban board with 3 columns and drag-and-drop
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="rounded-xl rounded-tl-sm bg-white/[0.055] px-2.5 py-2 text-[8px] leading-[1.55] text-white/55 sm:px-3 sm:text-[9px]">
                      I’ll build a Kanban board with Todo, In Progress, and Done
                      columns. I’ll use{" "}
                      <span className="text-blue-300">@dnd-kit/core</span> for
                      smooth drag-and-drop.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 items-center gap-1 rounded-full bg-white/[0.07] px-2">
                      <i className="size-1 rounded-full bg-white/40" />
                      <i className="size-1 rounded-full bg-white/40" />
                      <i className="size-1 rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
                <div className="m-2 flex h-7 items-center justify-between rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 text-[8px] text-white/25 sm:m-3 sm:h-8 sm:px-3 sm:text-[9px]">
                  Ask AI to modify...
                  <span aria-hidden="true" className="text-white/30">
                    →
                  </span>
                </div>
              </aside>

              {/* Preview panel */}
              <div className="min-w-0 flex-1 bg-[radial-gradient(ellipse_at_55%_0%,rgba(59,130,246,0.075),transparent_58%),#111111]">
                <div className="flex h-9 items-stretch gap-4 border-b border-white/[0.06] px-3 sm:px-4">
                  <div className="flex items-center border-b border-sky-400 px-1 text-[9px] font-medium text-sky-200 shadow-[0_1px_10px_rgba(56,189,248,0.25)]">
                    Preview
                  </div>
                  <div className="flex items-center px-1 text-[9px] text-white/35">
                    Code
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2.5 sm:gap-3 sm:p-4">
                  {[
                    {
                      title: "TODO",
                      count: "3",
                      accent: "bg-white/25",
                      cards: ["w-3/4", "w-5/6", "w-4/5"],
                    },
                    {
                      title: "IN PROGRESS",
                      count: "2",
                      accent: "bg-sky-400",
                      cards: ["w-3/4", "w-4/5"],
                    },
                    {
                      title: "DONE",
                      count: "1",
                      accent: "bg-emerald-400",
                      cards: ["w-3/4"],
                    },
                  ].map((column) => (
                    <div key={column.title} className="min-w-0">
                      <div className="mb-2 flex h-4 items-center gap-1.5 overflow-hidden text-[7px] font-medium tracking-wide text-white/35 sm:mb-2.5 sm:gap-2 sm:text-[8px]">
                        <span
                          className={`size-1 shrink-0 rounded-full ${column.accent}`}
                        />
                        <span className="truncate">{column.title}</span>
                        <span className="flex size-3 shrink-0 items-center justify-center rounded-full bg-white/[0.09] text-[7px] text-white/50 sm:size-3.5">
                          {column.count}
                        </span>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        {column.cards.map((width, index) => (
                          <div
                            key={`${column.title}-${index}`}
                            className="flex h-7 flex-col justify-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.035] px-1.5 sm:h-8 sm:gap-1.5 sm:px-2"
                          >
                            <span
                              className={`block h-1 rounded-full bg-white/[0.16] ${width}`}
                            />
                            <span
                              className={`block h-1 max-w-full rounded-full bg-white/[0.09] ${index % 2 === 0 ? "w-11/12" : "w-3/4"}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need Section  */}
      <section className="px-4 pb-32 pt-4 sm:px-6 sm:pt-8">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Everything You Need</SectionLabel>
          <SectionHeading gray="From prompt" blue="to production." />
        </div>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label, desc }) => {
            return (
              <div
                key={label}
                className="group min-h-[132px] bg-[#0b0b0b] p-4 transition-colors hover:bg-[#101010] sm:p-5"
              >
                <div className="mb-3 flex size-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] transition-colors group-hover:border-blue-400/20 group-hover:bg-blue-400/[0.08]">
                  <Icon className="size-3.5 text-white/60 transition-colors group-hover:text-blue-300" />
                </div>
                <p className="mb-1.5 text-[11px] font-semibold text-white/90">
                  {label}
                </p>
                <p className="text-[10px] leading-[1.55] text-white/40 sm:text-[11px]">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works Section  */}
      <section className="px-4 pb-32 pt-4 sm:px-6 sm:pt-8">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>How it work </SectionLabel>
          <SectionHeading gray="Four steps" blue="to a workinh app." />
        </div>
        <div className="mx-auto max-w-3xl">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex felx-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4">
                  <span className="font-mono text-xs font-semibold text-white/50">
                    {step.number}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mt-2 h-full w-px bg-white/6" />
                )}
              </div>
              <div className="pb-10 pt-1.5">
                <p className="mb-1.5 text-sm font-semibold sm:text-base">
                  {step.label}
                </p>
                <p className="text-sm leading-relaxed text-white/40">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section  */}
      <section className="px-4 pb-32 pt-4 sm:px-6 sm:pt-8">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Simple Pricing </SectionLabel>
          <SectionHeading gray="Start free," blue="scale when ready." />
          <p className="mx-auto mt-4 max-w-sm text-sm text-white/35">
            {" "}
            No Credit card required. Upgrade or downgrade anytime
          </p>
        </div>
        <div className="mx-auto max-w-3xl">{/* pricing table */}</div>
      </section>

      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/8 px-10 py-24 text-center">
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
        <SectionHeading gray="Start Building," blue="for free." />

        <p className="mb-8 text-sm leading-relaxed text-white/40 ">
          Get 10 free generations on sign up. No credit card required.
          <br />
          Upgrade when you're ready
        </p>

        <SignInButton mode="model">
          <Button
            size="lg"
            className="relative h-11 rounded-full bg-white px-8 text-black font-bold"
          >
            Get Started free
          </Button>
        </SignInButton>
      </section>

      <footer className="relative z-10 border-t border-white/7 py-12 mx-auto px-6 flex felx-wrap items-center justify-center text-stone-400">
        Made with ❤️ by Sanyogita Dahale
      </footer>


    </main>

  );
}
