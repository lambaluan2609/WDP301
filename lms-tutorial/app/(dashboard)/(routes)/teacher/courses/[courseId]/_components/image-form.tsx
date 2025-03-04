"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl);

  const toggleEdit = () => setEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 shadow-sm rounded-lg p-5">
      <div className="font-medium flex items-center justify-between text-gray-800">
        Course Image
        <Button
          onClick={toggleEdit}
          variant="outline"
          className="hover:bg-blue-50 transition text-blue-600 border-blue-600"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2 text-blue-600" />
              {imageUrl ? "Edit Image" : "Add Image"}
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="flex justify-center items-center w-full mt-2">
          {!imageUrl ? (
            <div className="flex items-center justify-center h-40 bg-slate-200 rounded-md w-full max-w-md">
              <ImageIcon className="h-10 w-10 text-slate-500" />
            </div>
          ) : (
            <div className="relative w-full max-w-md h-40">
              <Image
                alt="Uploaded Image"
                src={imageUrl.startsWith("http") ? imageUrl : "/fallback.jpg"}
                width={320}
                height={180}
                className="object-contain rounded-md w-full h-full"
              />
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-4 space-y-4">
          <FileUpload
            endPoint="/api/upload"
            onChange={(url) => {
              if (url) {
                setImageUrl(url);
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-gray-500 italic">
            Recommended: 16:9 aspect ratio
          </div>
        </div>
      )}
    </div>
  );
};
