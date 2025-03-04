"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Badge, Grip, Pencil } from "lucide-react";

interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ChapterList = ({ items, onReorder, onEdit }: ChapterListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updatedChapters = Array.from(chapters);
    const [movedItem] = updatedChapters.splice(result.source.index, 1);
    updatedChapters.splice(result.destination.index, 0, movedItem);

    setChapters(updatedChapters);

    const bulkUpdateData = updatedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: index,
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center justify-between rounded-lg p-4 shadow-md transition duration-200 ${
                      chapter.isPublished
                        ? "bg-blue-100 border border-blue-300 text-blue-800"
                        : "bg-gray-100 border border-gray-300 text-gray-700"
                    }`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="p-2 cursor-grab hover:bg-gray-300 rounded-lg transition"
                    >
                      <Grip className="h-5 w-5 text-gray-600" />
                    </div>

                    <span className="text-lg font-medium">{chapter.title}</span>

                    <div className="flex items-center space-x-3">
                      {chapter.isFree && (
                        <Badge className="bg-green-500 text-white px-2 py-1 text-xs rounded-md">
                          Free
                        </Badge>
                      )}
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                          chapter.isPublished
                            ? "bg-blue-600 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </span>
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
