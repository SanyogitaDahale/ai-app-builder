import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense
      fallback={<div className="text-sm text-white/60">Loading sign in…</div>}
    >
      <SignIn signUpUrl="/sign-up" />
    </Suspense>
  );
}
