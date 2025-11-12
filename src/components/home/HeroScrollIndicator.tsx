import { ChevronDown } from "lucide-react";

export const HeroScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer">
      <div className="flex flex-col items-center gap-1">
        <ChevronDown className="w-6 h-6 text-white/60" />
        <p className="text-xs text-white/60 uppercase tracking-wider">Scroll</p>
      </div>
    </div>
  );
};
