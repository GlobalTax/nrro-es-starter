interface StatProps {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const Stat = ({ label, value, prefix = "", suffix = "", className = "" }: StatProps) => {
  return (
    <div className={`flex flex-col gap-2 items-center md:items-start ${className}`}>
      <dt className="text-5xl md:text-6xl font-display font-normal text-foreground flex items-baseline gap-1">
        {prefix && <span className="text-4xl md:text-5xl">{prefix}</span>}
        <span>{value}</span>
        {suffix && <span className="text-3xl md:text-4xl">{suffix}</span>}
      </dt>
      <dd className="text-sm md:text-base text-muted-foreground font-normal leading-tight text-center md:text-left">
        {label}
      </dd>
    </div>
  );
};
