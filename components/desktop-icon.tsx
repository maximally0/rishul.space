"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon: Icon,
  label,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "desktop-icon flex flex-col items-center justify-center w-20 p-2 cursor-pointer group hover:bg-white/20 hover:border hover:border-dashed hover:border-white transition-all",
        className
      )}
      onClick={onClick}
    >
      <Icon className="w-8 h-8 text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" />
      <span className="mt-1 text-[11px] text-white text-center leading-tight drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] select-none">
        {label}
      </span>
    </div>
  );
};
