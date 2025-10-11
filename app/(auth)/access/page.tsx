"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowRight, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const emailSchema = z
  .string()
  .email({ message: "Ingresa un correo válido" })
  .transform((value) => value.trim().toLowerCase());

const otpSchema = z
  .string()
  .length(6, { message: "El código debe tener 6 dígitos" })
  .regex(/^[0-9]{6}$/, { message: "El código solo debe contener números" });

const OTP_RESEND_INTERVAL_SECONDS = 60;

type Stage = "email" | "verify" | "success";

export default function AccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = useMemo(() => {
    const raw = searchParams.get("callbackUrl");
    if (!raw) {
      return "/dashboard";
    }

    try {
      const url = raw.startsWith("http") ? new URL(raw) : new URL(raw, "http://localhost:3000");
      const path = url.pathname || "/dashboard";

      if (path === "/access" || path === "/login") {
        return "/dashboard";
      }

      const normalized = `${path}${url.search}${url.hash}` || "/dashboard";
      return normalized;
    } catch {
      return "/dashboard";
    }
  }, [searchParams]);

  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const resetFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const startCountdown = useCallback(() => {
    setSecondsLeft(OTP_RESEND_INTERVAL_SECONDS);
  }, []);

  const handleSendOtp = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetFeedback();

      const formData = new FormData(event.currentTarget);
      const emailValue = formData.get("email");

      const parsed = emailSchema.safeParse(emailValue);
      if (!parsed.success) {
        setError(parsed.error.errors[0]?.message ?? "Correo inválido");
        return;
      }

      const normalizedEmail = parsed.data;
      setEmail(normalizedEmail);

      startTransition(() => {
        void (async () => {
          try {
            const response = await fetch("/api/auth/send-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: normalizedEmail }),
            });

            if (!response.ok) {
              const data = (await response.json().catch(() => ({}))) as { error?: string };
              throw new Error(data.error ?? "No fue posible enviar el código, intenta más tarde.");
            }

            setOtp("");
            setStage("verify");
            setMessage("Código enviado. Revisa tu bandeja y carpeta de spam.");
            startCountdown();
          } catch (err) {
            setError((err as Error).message);
          }
        })();
      });
    },
    [startCountdown],
  );

  const handleVerifyOtp = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetFeedback();

      const parsedOtp = otpSchema.safeParse(otp);
      if (!parsedOtp.success) {
        setError(parsedOtp.error.errors[0]?.message ?? "Código inválido");
        return;
      }

      startTransition(() => {
        void (async () => {
          try {
            // Validar OTP primero y obtener el userId
            const response = await fetch("/api/auth/verify-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, code: parsedOtp.data }),
            });

            if (!response.ok) {
              const data = (await response.json().catch(() => ({}))) as { error?: string };
              throw new Error(data.error ?? "Código inválido");
            }

            const { userId } = (await response.json()) as { userId: string };

            // Ahora iniciar sesión con NextAuth usando el userId validado
            const signInResponse = await signIn("otp", {
              email,
              userId, // Pasar el userId en lugar del código
              redirect: false,
            });

            if (signInResponse?.error) {
              throw new Error("No se pudo iniciar sesión. Intenta nuevamente.");
            }

            const determineDestination = (url: string | null | undefined) => {
              if (!url) {
                return callbackUrl;
              }

              try {
                const parsedUrl = url.startsWith("http") ? new URL(url) : new URL(url, "http://localhost:3000");
                const path = parsedUrl.pathname || "/dashboard";

                if (path === "/access" || path === "/login") {
                  return callbackUrl;
                }

                return `${path}${parsedUrl.search}${parsedUrl.hash}` || "/dashboard";
              } catch {
                return callbackUrl;
              }
            };

            const destination = determineDestination(signInResponse?.url);
            setStage("success");
            setMessage("Acceso concedido. Redirigiendo...");
            router.replace(destination);
          } catch (err) {
            setError((err as Error).message);
          }
        })();
      });
    },
    [callbackUrl, email, otp, router],
  );

  const handleResend = useCallback(() => {
    if (!email || secondsLeft > 0) return;
    resetFeedback();

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            const data = (await response.json().catch(() => ({}))) as { error?: string };
            throw new Error(data.error ?? "No fue posible enviar el código, intenta más tarde.");
          }

          setMessage("Nuevo código enviado. Revisa tu correo.");
          startCountdown();
        } catch (err) {
          setError((err as Error).message);
        }
      })();
    });
  }, [email, secondsLeft, startCountdown]);

  const renderEmailStage = () => (
    <form className="space-y-8" onSubmit={handleSendOtp} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Correo electrónico
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tucorreo@empresa.com"
            className="h-12 rounded-xl border border-white/10 bg-white/5 pl-10 text-base text-foreground backdrop-blur focus-visible:ring-[rgba(147,197,253,0.55)]"
            aria-describedby={error ? "email-error" : undefined}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <LoaderCircle className="size-4 animate-spin" />
            Enviando código
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Enviar código
            <ArrowRight className="size-4" />
          </span>
        )}
      </Button>
    </form>
  );

  const renderVerifyStage = () => (
    <form className="space-y-6" onSubmit={handleVerifyOtp} noValidate>
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Ingresa tu código
        </Label>
        <Input
          id="otp"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          value={otp}
          maxLength={6}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, "");
            if (value.length <= 6) {
              setOtp(value);
            }
          }}
          className="h-14 rounded-xl border border-white/10 bg-white/5 text-center text-3xl tracking-[0.5em] text-foreground focus-visible:ring-[rgba(165,180,252,0.6)]"
          aria-describedby={error ? "otp-error" : undefined}
        />
        <p className="text-xs text-muted-foreground">
          Código enviado a <span className="font-semibold text-foreground">{email}</span>. Expira en 5 minutos.
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {secondsLeft > 0 ? (
          <span suppressHydrationWarning>
            Puedes reenviar en <span className="font-semibold text-primary">{secondsLeft}s</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-medium text-primary transition hover:text-primary/80"
          >
            Reenviar código
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setStage("email");
            setOtp("");
            resetFeedback();
          }}
          className="text-xs uppercase tracking-[0.25em] text-muted-foreground/70 transition hover:text-foreground"
        >
          Cambiar correo
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={isPending || otp.length !== 6}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <LoaderCircle className="size-4 animate-spin" />
            Verificando
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Confirmar acceso
            <CheckCircle2 className="size-4" />
          </span>
        )}
      </Button>
    </form>
  );

  const renderSuccessStage = () => (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-full bg-emerald-500/10 p-4">
        <CheckCircle2 className="size-8 text-emerald-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-foreground">¡Acceso concedido!</h3>
        <p className="text-sm text-muted-foreground">
          Estamos redirigiéndote al panel principal. Si no ocurre automáticamente, haz clic en el botón.
        </p>
      </div>
      <Button onClick={() => router.push(callbackUrl)} className="w-full">
        Ir al dashboard
      </Button>
    </div>
  );

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-xl">
      <CardHeader className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">DeltaManager</p>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-semibold text-foreground">
            Acceso seguro con código OTP
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            Ingresa tu correo para recibir un código de 6 dígitos. El código es válido durante 5 minutos y se envía
            desde nuestro servidor seguro.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {message ? (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        ) : null}
        {error ? (
          <div
            id={stage === "email" ? "email-error" : "otp-error"}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
          >
            {error}
          </div>
        ) : null}

        <div className={cn("space-y-6", { "pointer-events-none opacity-70": isPending })}>
          {stage === "email" ? renderEmailStage() : null}
          {stage === "verify" ? renderVerifyStage() : null}
          {stage === "success" ? renderSuccessStage() : null}
        </div>
      </CardContent>
    </Card>
  );
}


