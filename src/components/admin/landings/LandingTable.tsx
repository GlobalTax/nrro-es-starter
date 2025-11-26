import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Pencil } from "lucide-react";
import { LandingStatusBadge } from "./LandingStatusBadge";
import { LandingCategoryBadge } from "./LandingCategoryBadge";
import type { LandingPage } from "@/hooks/useLandingPages";

interface LandingTableProps {
  landings: LandingPage[];
  onEdit: (landing: LandingPage) => void;
}

export const LandingTable = ({ landings, onEdit }: LandingTableProps) => {
  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">URL</TableHead>
            <TableHead className="font-semibold text-center">Version</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {landings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No landings found
              </TableCell>
            </TableRow>
          ) : (
            landings.map((landing) => (
              <TableRow key={landing.id}>
                <TableCell className="font-medium">{landing.title}</TableCell>
                <TableCell>
                  <LandingCategoryBadge category={landing.category || 'Other'} />
                </TableCell>
                <TableCell>
                  <LandingStatusBadge status={landing.status || 'draft'} />
                </TableCell>
                <TableCell>
                  {landing.url ? (
                    <a
                      href={landing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 max-w-[200px] truncate"
                    >
                      {landing.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                    v{landing.version || 1}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {landing.created_at
                    ? new Date(landing.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/admin/landings/${landing.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(landing)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
