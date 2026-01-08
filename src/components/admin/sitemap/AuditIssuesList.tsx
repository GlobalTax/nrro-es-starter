import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AuditIssue, AuditRecommendation } from "@/hooks/usePageAudit";

interface AuditIssuesListProps {
  issues: AuditIssue[];
  recommendations: AuditRecommendation[];
}

export function AuditIssuesList({ issues, recommendations }: AuditIssuesListProps) {
  const getSeverityIcon = (severity: AuditIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadgeColor = (severity: AuditIssue['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const getTypeBadgeColor = (type: AuditIssue['type']) => {
    switch (type) {
      case 'seo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'content':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'structure':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    }
  };

  const getPriorityBadgeColor = (priority: AuditRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (issues.length === 0 && recommendations.length === 0) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <CheckCircle2 className="h-5 w-5" />
        <span>No se encontraron problemas significativos</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Issues Section */}
      {sortedIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Problemas detectados ({sortedIssues.length})
          </h4>
          <div className="space-y-2">
            {sortedIssues.map((issue, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className={cn("text-xs", getSeverityBadgeColor(issue.severity))}>
                        {issue.severity === 'error' ? 'Error' : issue.severity === 'warning' ? 'Aviso' : 'Info'}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs", getTypeBadgeColor(issue.type))}>
                        {issue.type === 'seo' ? 'SEO' : issue.type === 'content' ? 'Contenido' : 'Estructura'}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{issue.message}</p>
                    {issue.recommendation && (
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 {issue.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {sortedRecommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Recomendaciones ({sortedRecommendations.length})
          </h4>
          <div className="space-y-2">
            {sortedRecommendations.map((rec, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className={cn("text-xs", getPriorityBadgeColor(rec.priority))}>
                        {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.category}
                      </Badge>
                    </div>
                    <p className="text-sm">{rec.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
