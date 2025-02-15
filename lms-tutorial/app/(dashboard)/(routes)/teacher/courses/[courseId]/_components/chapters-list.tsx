"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggble,
  DropResult,
} from "@hello-pangea/dnd";
import { Badge, Grip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}
// export const ChapterList = ({ items, onReorder, onEdit }: ChapterListProps) => {
//   const [isMounted, setIsMounted] = useState(false);
//   const [chapters, setChapters] = useState(items);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     setChapters(items);
//   }, [items]);

//   if (!isMounted) {
//     return null;
//   }
//   return (
//     <DragDropContext onDragEnd={() => {}}>
//       <Droppable droppabledId="chapters">
//         {(provided) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             {chapters.map((chapters, index) => (
//               <Draggble
//                 key={chapters.id}
//                 draggableId={chapters.id}
//                 index={index}
//               >
//                 {(provided) => {
//                   <div
//                     className={cn(
//                       "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
//                       chapters.isPublished &&
//                         "bg-sky-100 border-sky-200 text-sky-700"
//                     )}
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                   >
//                     <div
//                       className={cn(
//                         "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
//                         chapters.isPublished &&
//                           " border-r-sky-200 hover:bg-sky-200"
//                       )}
//                       {...provided.dragHandleProps}
//                     >
//                       <Grip className="h-5 w-5" />
//                     </div>
//                     {chapters.title}
//                     <div className="ml-auto pr-2 gap-x-2">
//                       {chapters.isFree && <Badge>Free</Badge>}
//                       <Badge
//                         className={cn(
//                           "bg-slate-500",
//                           chapters.isPublished && "bg-sky-700"
//                         )}
//                       >
//                         {chapters.isPublished ? "Published" : "Draft"}
//                       </Badge>
//                     </div>
//                   </div>;
//                 }}
//               </Draggble>
//             ))}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

export const ChapterList = () => {
  return <div>List</div>;
};
