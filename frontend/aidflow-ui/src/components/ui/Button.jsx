import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold text-white transition-all duration-300",

          // 💎 Premium gradient
          "bg-gradient-to-r from-blue-500 to-purple-600",

          // 🔥 Glow + hover
          "shadow-lg hover:shadow-purple-500/40 hover:scale-105",

          // 🎯 Focus effect
          "focus:outline-none focus:ring-2 focus:ring-purple-500",

          // ⛔ Disabled
          "disabled:opacity-50 disabled:cursor-not-allowed",

          {
            "px-4 py-2 text-sm": size === "default",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-8 py-3 text-lg": size === "lg",
          },

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };