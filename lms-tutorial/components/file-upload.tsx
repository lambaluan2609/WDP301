// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import toast from "react-hot-toast";
// import Image from "next/image";

// interface FileUploadProps {
//   endPoint: string;
//   onChange: (url?: string) => void;
// }

// export const FileUpload = ({ onChange }: FileUploadProps) => {
//   const [uploading, setUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [fileType, setFileType] = useState<string | null>(null);

//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     setFileName(file.name);
//     setFileType(file.type);

//     try {
//       const sanitizedFileName = file.name
//         .replace(/\s+/g, "_")
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "");
//       const filePath = `uploads/${sanitizedFileName}`;
//       const { data, error } = await supabase.storage
//         .from("Group5")
//         .upload(filePath, file, { upsert: true });

//       if (error) throw error;

//       const { data: urlData } = supabase.storage
//         .from("Group5")
//         .getPublicUrl(filePath);
//       const publicUrl = urlData.publicUrl;

//       if (!publicUrl) throw new Error("Unable to get public URL");

//       setPreviewUrl(publicUrl);
//       onChange(publicUrl);
//       toast.success("Upload successful!");
//     } catch (error: any) {
//       toast.error(`Upload error: ${error.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition">
//         <p className="text-gray-500 text-sm">
//           {previewUrl ? "Edit file" : "Add file (Click or drag and drop)"}
//         </p>
//         <input
//           type="file"
//           onChange={handleFileUpload}
//           disabled={uploading}
//           className="hidden"
//         />
//       </label>

//       {fileName && <p className="text-gray-600 text-sm">📂 {fileName}</p>}
//       {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}

//       {previewUrl && fileType?.startsWith("image/") && (
//         <div className="border rounded-lg p-2 w-30 h-40 flex items-center justify-center">
//           <Image
//             src={previewUrl}
//             alt="Uploaded photo"
//             width={250}
//             height={300}
//             className="rounded-md"
//           />
//         </div>
//       )}

//       {previewUrl && !fileType?.startsWith("image/") && (
//         <a
//           href={previewUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 underline"
//         >
//           📄 View or download file {fileName}
//         </a>
//       )}
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import Image from "next/image";

interface FileUploadProps {
  onChange: (urls: string[]) => void;
}

export const FileUpload = ({ onChange }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    const names: string[] = [];
    const types: string[] = [];

    try {
      for (const file of files) {
        const sanitizedFileName = file.name
          .replace(/\s+/g, "_")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        const filePath = `uploads/${sanitizedFileName}`;
        const { data, error } = await supabase.storage
          .from("Group5")
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("Group5")
          .getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;

        if (!publicUrl) throw new Error("Unable to get public URL");

        uploadedUrls.push(publicUrl);
        names.push(file.name);
        types.push(file.type);
      }

      setPreviewUrls([...previewUrls, ...uploadedUrls]);
      setFileNames([...fileNames, ...names]);
      setFileTypes([...fileTypes, ...types]);

      onChange(uploadedUrls);
      toast.success("Upload successful!");
    } catch (error: any) {
      toast.error(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition">
        <p className="text-gray-500 text-sm">
          {previewUrls.length > 0
            ? "Add more files"
            : "Click or drag to upload multiple files"}
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {fileNames.length > 0 && (
        <div className="space-y-2">
          {fileNames.map((name, index) => (
            <p key={index} className="text-gray-600 text-sm">
              📂 {name}
            </p>
          ))}
        </div>
      )}

      {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}

      <div className="flex flex-wrap gap-2">
        {previewUrls.map((url, index) =>
          fileTypes[index]?.startsWith("image/") ? (
            <Image
              key={index}
              src={url}
              alt="Uploaded"
              width={100}
              height={100}
              className="rounded-md"
            />
          ) : (
            <a
              key={index}
              href={url}
              target="_blank"
              className="text-blue-600 underline"
            >
              📄 {fileNames[index]}
            </a>
          )
        )}
      </div>
    </div>
  );
};
