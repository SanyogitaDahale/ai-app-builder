import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <Suspense
      fallback={<div className="text-sm text-white/60">Loading sign up…</div>}
    >
      <SignUp signInUrl="/sign-in" />
    </Suspense>
  );
}
