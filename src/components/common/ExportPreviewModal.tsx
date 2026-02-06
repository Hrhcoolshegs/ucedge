import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ShieldCheck, Clock } from 'lucide-react';
import { useExportApprovalRequired } from '@/hooks/usePermission';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useState } from 'react';

interface ExportPreviewModalProps {
  title: string;
  columns: string[];
  rows: string[][];
  onClose: () => void;
  containsPII?: boolean;
  recordCount?: number;
}

export function ExportPreviewModal({ title, columns, rows, onClose, containsPII = false, recordCount }: ExportPreviewModalProps) {
  const count = recordCount ?? rows.length;
  const requiresApproval = useExportApprovalRequired(count, containsPII);
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const handleExport = () => {
    if (requiresApproval) {
      setSubmitted(true);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold">Export Submitted for Approval</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Your export request for {count} records has been submitted to the approval queue.
              An admin will review and approve it shortly.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-1 py-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{count} total records</span>
                <span>{columns.length} columns</span>
                <span>Preview showing {Math.min(rows.length, 20)} rows</span>
              </div>
              {requiresApproval && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Approval Required
                </div>
              )}
              {!requiresApproval && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Export Ready
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto border rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50 sticky top-0">
                    {columns.map((col, i) => (
                      <th key={i} className="text-left p-2 font-semibold text-muted-foreground whitespace-nowrap border-b">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((row, ri) => (
                    <tr key={ri} className="border-b hover:bg-muted/30">
                      {row.map((cell, ci) => (
                        <td key={ci} className="p-2 whitespace-nowrap max-w-[200px] truncate">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleExport}>
                {requiresApproval ? (
                  <><Clock className="h-4 w-4 mr-1" /> Submit for Approval</>
                ) : (
                  <><Download className="h-4 w-4 mr-1" /> Download Ready</>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
