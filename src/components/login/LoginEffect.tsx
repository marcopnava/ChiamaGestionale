"use client";

import { AppleHelloEnglishEffect } from "@/components/ui/shadcn-io/apple-hello-effect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LoginEffectProps {
  onComplete?: () => void;
}

const LoginEffect = ({ onComplete }: LoginEffectProps) => {
  const router = useRouter();

  const handleAnimationComplete = () => {
    setTimeout(() => {
      onComplete?.();
      router.push("/");
    }, 1000);
  };

  return (
    <div className="flex w-full h-screen flex-col justify-center items-center gap-16 bg-background">
      <AppleHelloEnglishEffect 
        speed={1.1} 
        onAnimationComplete={handleAnimationComplete}
        className="text-primary"
      />
    </div>
  );
};

export default LoginEffect; 