"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  leftIcon?: LucideIcon | React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, leftIcon, containerClassName = "", className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const LeftIcon = leftIcon || icon;

    return (
      <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-bold uppercase tracking-widest text-[#a89f91] ml-4 block"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {LeftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89f91] group-focus-within:text-[#a3573a] transition-colors pointer-events-none">
              {React.isValidElement(LeftIcon) ? (
                LeftIcon
              ) : (
                React.createElement(LeftIcon as React.ComponentType<{ size?: number }>, { size: 18 })
              )}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-white border border-[#e5dfd3] rounded-2xl text-sm 
              text-[#1a1c13] font-medium placeholder:text-[#a89f91]/40
              focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${LeftIcon ? "pl-12 pr-6" : "px-6"} 
              py-4
              ${error ? "border-red-500 focus:ring-red-500" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] font-bold text-red-500 ml-4 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
