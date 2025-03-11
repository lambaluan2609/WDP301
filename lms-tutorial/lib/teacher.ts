export const isTeacher = (userId?: string | null) => {
  console.log('AAA',userId)
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};
