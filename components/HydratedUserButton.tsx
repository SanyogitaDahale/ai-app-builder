"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const HydratedUserButton = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div aria-hidden="true" className="h-8 w-8" />;
  }

  return <UserButton />;
};

export default HydratedUserButton;
