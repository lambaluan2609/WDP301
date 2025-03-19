"use server";

import { revalidatePath } from "next/cache";

export async function revalidateChapterPath(
  courseId: string,
  chapterId: string
) {
  revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
}

export async function revalidateCoursePath(courseId: string) {
  revalidatePath(`/courses/${courseId}`);
}
