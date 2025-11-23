import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LucideIcon } from "lucide-react";

// ============================================
// FormInput - Input mejorado
// ============================================

export interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, helperText, icon, iconPosition = "left", ...props }, ref) => {
    const id = React.useId();
    const hasError = !!error;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className={cn(hasError && "text-destructive")}>
            {label}
          </Label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <Input
            id={id}
            ref={ref}
            className={cn(
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

// ============================================
// FormTextarea - Textarea mejorado
// ============================================

export interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const id = React.useId();
    const hasError = !!error;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className={cn(hasError && "text-destructive")}>
            {label}
          </Label>
        )}
        <Textarea
          id={id}
          ref={ref}
          className={cn(
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

// ============================================
// FormSelect - Select mejorado
// ============================================

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps extends React.ComponentProps<"select"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: FormSelectOption[];
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, label, error, helperText, options, placeholder, ...props }, ref) => {
    const id = React.useId();
    const hasError = !!error;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className={cn(hasError && "text-destructive")}>
            {label}
          </Label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";

// ============================================
// FormCheckbox - Checkbox mejorado
// ============================================

export interface FormCheckboxProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const id = React.useId();
    const hasError = !!error;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            className={cn(
              "h-4 w-4 rounded border-input text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2",
              hasError && "border-destructive",
              className
            )}
            {...props}
          />
          {label && (
            <Label
              htmlFor={id}
              className={cn("cursor-pointer", hasError && "text-destructive")}
            >
              {label}
            </Label>
          )}
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);
FormCheckbox.displayName = "FormCheckbox";
