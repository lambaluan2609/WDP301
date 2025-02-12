"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
}

export const FileUpload = ({ onChange }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const { data, error } = await supabase.storage
        .from('Group5')
        .upload(`public/${file.name}`, file);

      if (error) {
        throw error;
      }

      const { publicURL, error: urlError } = supabase.storage
        .from('Group5')
        .getPublicUrl(`public/${file.name}`);

      if (urlError) {
        throw urlError;
      }

      onChange(publicURL);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
};