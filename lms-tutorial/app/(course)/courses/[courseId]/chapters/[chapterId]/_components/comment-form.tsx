"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface CommentFormProps {
  chapterId: string;
  userId: string;
  parentId?: string;
}

const formSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

const CommentForm = ({ chapterId, userId, parentId }: CommentFormProps) => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { comment: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/comments`, {
        userId,
        chapterId,
        content: values.comment,
        parentId,
      });

      toast.success("Comment added successfully!");
      form.reset();
      setIsFocused(false);
      router.refresh();
    } catch {
      toast.error("Failed to post comment.");
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsFocused(false);
  };

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                    {!isFocused ? (
                      // Hiển thị chỉ là 1 dòng giả placeholder như gạch ngang
                      <div
                        onClick={() => setIsFocused(true)}
                        className="cursor-text border-b border-gray-300 text-gray-500 py-2 px-1"
                      >
                        Add a comment...
                      </div>
                    ) : (
                      // Khi focus hiện textarea đầy đủ
                      <textarea
                        {...field}
                        placeholder="Write your comment here..."
                        className="w-full min-h-[80px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                        autoFocus
                      />
                    )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isFocused && (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Post
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
