import { ShieldCheck, Sparkles, Truck } from "lucide-react";

interface AuthHeroProps {
  title: string;
  description: string;
  badgeLabel?: string;
}

export function AuthHero({
  title,
  description,
  badgeLabel = "Welcome back",
}: AuthHeroProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-border/60 bg-card p-10 shadow-xl">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          {badgeLabel}
        </div>

        <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          {description}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background p-5">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Secure access
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account stays protected with a streamlined sign-in flow.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-5">
            <Truck className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Faster checkout
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue where you left off and complete purchases quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}