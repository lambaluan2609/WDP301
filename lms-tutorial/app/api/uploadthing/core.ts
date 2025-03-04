import { createUploadthing, type FileRouter } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  const isAuthorized = isTeacher(userId);
  if (!userId || !isAuthorized) throw new Error("Unauthorized");
  return userId;
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const userId = await handleAuth();
      return { userId };
    })
    .onUploadComplete((data) => {
      console.log("Uploaded course image:", data);
    }),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async ({ req }) => {
      const userId = await handleAuth();
      return { userId };
    })
    .onUploadComplete((data) => {
      console.log("Uploaded course attachment:", data);
    }),

  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(async ({ req }) => {
      const userId = await handleAuth();
      return { userId };
    })
    .onUploadComplete((data) => {
      console.log("Uploaded chapter video:", data);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
