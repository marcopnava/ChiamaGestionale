import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Colonna sinistra: form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              {/* Logomark piccola */}
              <Image
                src="/chiama-logo-mark.svg"
                alt="ChiaMa.io"
                width={16}
                height={16}
                priority
              />
            </div>
            ChiaMa.io
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground md:text-left">
          Continuando accetti i{" "}
          <Link href="/legal/terms" className="underline underline-offset-4">
            Termini
          </Link>{" "}
          e l’{" "}
          <Link href="/legal/privacy" className="underline underline-offset-4">
            Informativa Privacy
          </Link>
          .
        </p>
      </div>

      {/* Colonna destra: branding */}
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 grid place-items-center p-10">
          <Image
            src="/chiama-logo.svg"
            alt="ChiaMa.io"
            width={720}
            height={240}
            className="h-auto w-[min(80%,820px)] dark:brightness-100"
            priority
          />
        </div>
      </div>
    </div>
  );
}
