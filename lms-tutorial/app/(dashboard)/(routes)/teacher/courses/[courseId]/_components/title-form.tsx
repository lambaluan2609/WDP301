// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Pencil } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// interface TitleFormProps {
//   initialData: {
//     title: string;
//   };
//   courseId: string;
// }

// const formSchema = z.object({
//   title: z.string().min(1, {
//     message: "Title is required",
//   }),
// });

// export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
//   const [isEditing, setEditing] = useState(false);

//   const toggleEdit = () => setEditing((current) => !current);

//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData,
//   });
//   const { isSubmitting, isValid } = form.formState;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       await axios.patch(`/api/courses/${courseId}`, values);
//       toast.success("Course updated");
//       toggleEdit();
//       router.refresh();
//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div className="mt-6 border bg-slate-100 rounded-md p-4">
//       <div className="font-medium flex items-center justify-between">
//         Course Title
//         <Button onClick={toggleEdit} variant="ghost">
//           {isEditing ? (
//             <>Cancel</>
//           ) : (
//             <>
//               <Pencil className="h-4  w-4 mr-2" />
//               Edit title
//             </>
//           )}
//         </Button>
//       </div>
//       {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
//       {isEditing && (
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-4 mt-4"
//           >
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input
//                       disabled={isSubmitting}
//                       placeholder="e.g. 'Advanced web development' "
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="flex items-center gap-x-2">
//               <Button disabled={!isValid || isSubmitting} type="submit">
//                 Save
//               </Button>
//             </div>
//           </form>
//         </Form>
//       )}
//     </div>
//   );
// };

"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleEdit = () => setEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 shadow-sm rounded-lg p-5">
      <div className="font-medium flex items-center justify-between text-gray-800">
        Course Title
        <Button
          onClick={toggleEdit}
          variant="outline"
          disabled={isSaving}
          className="hover:bg-blue-50 transition text-blue-600 border-blue-600"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2 text-blue-600" /> Edit title
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm text-gray-700 mt-2">{initialData.title}</p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSaving}
                      placeholder="e.g. 'Advanced Web Development'"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSaving}
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {isSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
