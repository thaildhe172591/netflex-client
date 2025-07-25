import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmitReport } from "@/hooks/use-submit-report";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  from: string;
  targetTitle: string;
}

const REPORT_REASONS = [
  { value: "inappropriate_content", label: "Inappropriate Content" },
  { value: "copyright_violation", label: "Copyright Violation" },
  { value: "spam", label: "Spam" },
  { value: "violence", label: "Violence" },
  { value: "harassment", label: "Harassment" },
  { value: "other", label: "Other" },
];

export function ReportDialog({
  open,
  onOpenChange,
  from,
  targetTitle,
}: ReportDialogProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const submitReport = useSubmitReport();

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    try {
      // Create JSON description with content and from information
      const jsonDescription = JSON.stringify({
        content: description.trim() || "",
        from: from,
      });

      await submitReport.mutateAsync({
        reason,
        description: jsonDescription,
      });

      setReason("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  };

  const isSubmitDisabled = !reason.trim() || submitReport.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report</DialogTitle>
          <DialogDescription>
            Report &quot;{targetTitle}&quot; for inappropriate content or
            violations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide additional context about your report..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitReport.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="bg-red-600 hover:bg-red-700"
          >
            {submitReport.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
