// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { PlusCircle, File, Loader2, X } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Course, Attachment } from "@prisma/client";
// import { FileUpload } from "@/components/file-upload";

// interface AttachmentFormProps {
//   initialData: Course & { attachments: Attachment[] };
//   courseId: string;
// }

// const formSchema = z.object({
//   urls: z.array(z.string().min(1)),
// });

// export const AttachmentForm = ({
//   initialData,
//   courseId,
// }: AttachmentFormProps) => {
//   const [isEditing, setEditing] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const router = useRouter();

//   const toggleEdit = () => setEditing((current) => !current);

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       setIsUploading(true);
//       await axios.patch(`/api/courses/${courseId}/attachments`, values);
//       toast.success("Course updated");
//       toggleEdit();
//       router.refresh();
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const onDelete = async (id: string) => {
//     try {
//       setDeletingId(id);
//       await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
//       toast.success("Attachment deleted");
//       router.refresh();
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div className="mt-6 border bg-slate-100 rounded-md p-4">
//       <div className="font-medium flex items-center justify-between">
//         Course Attachments
//         <Button onClick={toggleEdit} variant="ghost" disabled={isUploading}>
//           {isEditing ? (
//             "Cancel"
//           ) : (
//             <>
//               <PlusCircle className="h-4 w-4 mr-2" /> Add files
//             </>
//           )}
//         </Button>
//       </div>

//       {!isEditing && (
//         <>
//           {initialData.attachments.length === 0 && (
//             <p className="text-sm mt-2 text-slate-500 italic">
//               No attachments yet
//             </p>
//           )}
//         </>
//       )}

//       {initialData.attachments.length > 0 && (
//         <div className="space-y-2">
//           {initialData.attachments.map((attachment) => (
//             <div
//               key={attachment.id}
//               className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
//             >
//               <File className="h-4 w-4 mr-2 flex-shrink-0" />
//               <p className="text-xs line-clamp-1">{attachment.name}</p>
//               {deletingId === attachment.id ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <button
//                   onClick={() => onDelete(attachment.id)}
//                   className="ml-auto hover:opacity-75 transition"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {isEditing && (
//         <div className="mt-4">
//           <FileUpload
//             endPoint="/api/upload"
//             onChange={(urls) => onSubmit({ urls: urls ? [urls] : [] })}
//           />
//           {isUploading && (
//             <p className="text-sm mt-2 text-blue-500">Uploading...</p>
//           )}
//           <div className="text-xs text-muted-foreground mt-4">
//             Add anything your students might need to complete the course.
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { PlusCircle, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, Attachment } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  urls: z.array(z.string().min(1)),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);
      await axios.patch(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 shadow-sm rounded-lg p-5">
      <div className="font-medium flex items-center justify-between text-gray-800">
        Course Attachments
        <Button
          onClick={toggleEdit}
          variant="outline"
          disabled={isUploading}
          className="hover:bg-blue-50 transition text-blue-600 border-blue-600"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2 text-blue-600" /> Add files
            </>
          )}
        </Button>
      </div>

      {!isEditing && initialData.attachments.length === 0 && (
        <p className="text-sm mt-2 text-gray-500 italic">No attachments yet</p>
      )}

      {initialData.attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center p-3 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm"
            >
              <File className="h-4 w-4 mr-2 flex-shrink-0 text-gray-600" />
              <p className="text-xs truncate">{attachment.name}</p>
              {deletingId === attachment.id ? (
                <Loader2 className="h-4 w-4 ml-auto animate-spin text-red-500" />
              ) : (
                <button
                  onClick={() => onDelete(attachment.id)}
                  className="ml-auto text-red-500 hover:opacity-75 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="mt-4">
          <FileUpload
            endPoint="/api/upload"
            onChange={(urls) => onSubmit({ urls: urls ? [urls] : [] })}
          />
          {isUploading && (
            <p className="text-sm mt-2 text-blue-500">Uploading...</p>
          )}
          <div className="text-xs text-gray-500 mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
