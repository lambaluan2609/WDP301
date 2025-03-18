"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NotesSection } from "./note-input";

interface NotesSectionWithToggleProps {
  userId: string;
  chapterId: string;
  courseId: string;
  isLocked: boolean;
  initialNotesVisible: boolean;
}

const NotesSectionWithToggle = ({
  userId,
  chapterId,
  courseId,
  isLocked,
  initialNotesVisible,
}: NotesSectionWithToggleProps) => {
  const [showNotes, setShowNotes] = useState(initialNotesVisible);

  return (
    <div className="p-4">
      <Button
        onClick={() => setShowNotes(!showNotes)}
        variant="outline"
        className="mb-4"
      >
        {showNotes ? "Hide Notes" : "Show Notes"}
      </Button>
      {showNotes && (
        <NotesSection
          userId={userId}
          chapterId={chapterId}
          courseId={courseId}
          isLocked={isLocked}
        />
      )}
    </div>
  );
};

export default NotesSectionWithToggle;