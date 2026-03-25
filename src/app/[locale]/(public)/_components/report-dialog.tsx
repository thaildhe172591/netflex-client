import { useState } from "react";
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
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useSubmitReport } from "@/hooks/use-submit-report";
import { LoadingButton } from "@/components/ui/loading-button";
import { appToast } from "@/lib/toast";

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

    const loadingId = appToast.loading({
      title: "Submitting report",
      description: "Sending details to moderation...",
    });
    try {
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
      appToast.success({
        title: "Report submitted",
      });
    } catch (error) {
      console.error("Failed to submit report:", error);
      appToast.error({
        title: "Could not submit report",
      });
    } finally {
      appToast.dismiss(loadingId);
    }
  };

  const isSubmitDisabled = !reason.trim() || submitReport.isPending;

  return (
    <ResponsiveDialog
      isOpen={open}
      setIsOpen={(value) => {
        if (typeof value === "boolean") {
          onOpenChange(value);
        } else {
          onOpenChange(value(open));
        }
      }}
      title="Report"
      description={`Report "${targetTitle}" for inappropriate content or violations.`}
      className="sm:max-w-[425px]"
    >
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

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={submitReport.isPending}
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          isLoading={submitReport.isPending}
          loadingLabel="Submitting..."
          className="bg-red-600 hover:bg-red-700"
        >
          Submit
        </LoadingButton>
      </div>
    </ResponsiveDialog>
  );
}
