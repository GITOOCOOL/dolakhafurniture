"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: LucideIcon | React.ReactNode;
  rightIcon?: LucideIcon | React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      primary: "bg-espresso text-bone hover:bg-action shadow-lg",
      secondary: "bg-stone-muted text-heading hover:bg-stone-muted/80",
      outline: "bg-transparent border border-divider text-heading hover:border-action hover:text-action",
      ghost: "bg-transparent text-heading hover:bg-espresso/5",
      accent: "bg-terracotta text-white hover:bg-espresso shadow-lg",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-md",
    };

    const sizes = {
      sm: "px-4 py-2 text-[8px]",
      md: "px-6 py-3.5 text-[10px]",
      lg: "px-8 py-5 text-[11px]",
      xl: "px-10 py-6 text-[12px]",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {LeftIcon && (
              <span className="mr-2">
                {typeof LeftIcon === "function" ? <LeftIcon size={16} /> : LeftIcon}
              </span>
            )}
            {children}
            {RightIcon && (
              <span className="ml-2">
                {typeof RightIcon === "function" ? <RightIcon size={16} /> : RightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
