import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    // Kiểm tra xem có bản ghi purchase không
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    // Ghi log để dễ dàng debug
    console.log(
      `[PURCHASE_STATUS] userId=${userId}, courseId=${courseId}, purchase=${!!purchase}`
    );

    return NextResponse.json({
      isPurchased: !!purchase,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[COURSE_PURCHASE_STATUS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
