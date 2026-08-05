"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { addRequestNote } from "@/actions/admin-request";
import { toast } from "sonner";

interface RequestNotesFormProps {
  requestId: string;
}

export function RequestNotesForm({ requestId }: RequestNotesFormProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await addRequestNote(requestId, note);
      if (result.success) {
        toast.success("Note added");
        setNote("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add note");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />
      <Button type="submit" size="sm" disabled={isSubmitting || !note.trim()}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Note"
        )}
      </Button>
    </form>
  );
}
