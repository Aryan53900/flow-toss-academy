import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const cyberButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        neon: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(var(--primary))] transform hover:scale-105",
        rock: "bg-gradient-to-br from-neon-blue/20 to-neon-blue/5 border-2 border-neon-blue text-neon-blue hover:bg-neon-blue/20 hover:shadow-[0_0_30px_hsl(var(--neon-blue))] transform hover:scale-110 transition-all duration-300",
        paper: "bg-gradient-to-br from-neon-green/20 to-neon-green/5 border-2 border-neon-green text-neon-green hover:bg-neon-green/20 hover:shadow-[0_0_30px_hsl(var(--neon-green))] transform hover:scale-110 transition-all duration-300",
        scissors: "bg-gradient-to-br from-neon-purple/20 to-neon-purple/5 border-2 border-neon-purple text-neon-purple hover:bg-neon-purple/20 hover:shadow-[0_0_30px_hsl(var(--neon-purple))] transform hover:scale-110 transition-all duration-300",
        cyber: "bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border border-primary/50 text-foreground hover:from-primary/30 hover:via-accent/30 hover:to-secondary/30 hover:shadow-[0_0_25px_hsl(var(--primary))] animate-neon-pulse",
        victory: "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 shadow-[0_0_20px_hsl(var(--accent))]",
        defeat: "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground hover:from-destructive/90 hover:to-destructive/70"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-16 rounded-lg px-12 text-lg",
        game: "h-24 w-24 rounded-xl p-4"
      }
    },
    defaultVariants: {
      variant: "neon",
      size: "default"
    }
  }
);

export interface CyberButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {}

const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(cyberButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CyberButton.displayName = "CyberButton";

export { CyberButton, cyberButtonVariants };