/**
 * INTRANET DESIGN SYSTEM - Componentes Base
 * Sistema de diseño unificado para CRM, HR, Marketing, Admin
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { 
  getStatusClasses, 
  getPriorityClasses, 
  type StatusType, 
  type PriorityType 
} from './admin-theme';

// ============================================
// PAGE HEADER
// ============================================

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function AdminPageHeader({ 
  title, 
  description, 
  actions,
  className 
}: AdminPageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

// ============================================
// STATS CARD
// ============================================

interface AdminStatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function AdminStatsCard({ 
  label, 
  value, 
  icon, 
  trend,
  className 
}: AdminStatsCardProps) {
  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-md p-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-normal">{label}</p>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <span className={cn(
            "text-xs font-medium",
            trend.isPositive ? "text-emerald-600" : "text-red-600"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// CARD
// ============================================

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function AdminCard({ 
  children, 
  className,
  padding = 'md',
  hover = false 
}: AdminCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-md",
      paddingClasses[padding],
      hover && "transition-colors hover:bg-gray-50",
      className
    )}>
      {children}
    </div>
  );
}

// ============================================
// BADGE
// ============================================

interface AdminBadgeProps {
  children: ReactNode;
  variant?: StatusType | PriorityType | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export function AdminBadge({ 
  children, 
  variant = 'default',
  size = 'sm',
  className 
}: AdminBadgeProps) {
  // Determine if it's a status or priority
  const isStatus = ['active', 'pending', 'inactive', 'urgent', 'completed', 'info', 'default'].includes(variant);
  const classes = isStatus 
    ? getStatusClasses(variant as StatusType) 
    : getPriorityClasses(variant as PriorityType);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={cn(
      "inline-flex items-center font-medium rounded-md border",
      classes,
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
}

// ============================================
// TABLE - Con zebra striping
// ============================================

interface AdminTableProps {
  children: ReactNode;
  className?: string;
}

export function AdminTable({ children, className }: AdminTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  );
}

interface AdminTableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableHeader({ children, className }: AdminTableHeaderProps) {
  return (
    <thead className={cn("border-b border-gray-200", className)}>
      {children}
    </thead>
  );
}

interface AdminTableBodyProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableBody({ children, className }: AdminTableBodyProps) {
  return (
    <tbody className={cn("[&>tr:nth-child(odd)]:bg-gray-50/50 [&>tr:nth-child(even)]:bg-white", className)}>
      {children}
    </tbody>
  );
}

interface AdminTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function AdminTableRow({ children, className, onClick, selected }: AdminTableRowProps) {
  return (
    <tr 
      className={cn(
        "border-b border-gray-100 hover:bg-gray-100/50 transition-colors",
        onClick && "cursor-pointer",
        selected && "bg-blue-50/50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface AdminTableHeadProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export function AdminTableHead({ 
  children, 
  className,
  sortable,
  sorted,
  onSort 
}: AdminTableHeadProps) {
  return (
    <th 
      className={cn(
        "text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider",
        sortable && "cursor-pointer select-none hover:text-gray-700",
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && sorted && (
          <span className="text-gray-400">
            {sorted === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
}

interface AdminTableCellProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableCell({ children, className }: AdminTableCellProps) {
  return (
    <td className={cn("py-3 px-4 text-gray-900", className)}>
      {children}
    </td>
  );
}

// ============================================
// SECTION DIVIDER
// ============================================

interface AdminDividerProps {
  className?: string;
}

export function AdminDivider({ className }: AdminDividerProps) {
  return (
    <hr className={cn("border-t border-gray-200 my-6", className)} />
  );
}

// ============================================
// EMPTY STATE
// ============================================

interface AdminEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function AdminEmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: AdminEmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      className
    )}>
      {icon && (
        <div className="text-gray-300 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
}

// ============================================
// LOADING SKELETON
// ============================================

interface AdminSkeletonProps {
  className?: string;
}

export function AdminSkeleton({ className }: AdminSkeletonProps) {
  return (
    <div className={cn(
      "animate-pulse bg-gray-200 rounded",
      className
    )} />
  );
}

// ============================================
// FILTER BAR
// ============================================

interface AdminFilterBarProps {
  children: ReactNode;
  className?: string;
}

export function AdminFilterBar({ children, className }: AdminFilterBarProps) {
  return (
    <div className={cn(
      "flex flex-wrap items-center gap-3 mb-4",
      className
    )}>
      {children}
    </div>
  );
}

// ============================================
// SECTION HEADER
// ============================================

interface AdminSectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function AdminSectionHeader({ 
  title, 
  description, 
  actions,
  className 
}: AdminSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div>
        <h2 className="text-base font-medium text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
