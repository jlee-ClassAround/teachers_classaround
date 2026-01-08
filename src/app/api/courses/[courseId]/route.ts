import { cojoobooDb } from "@/lib/cojoobooDb";
import { ivyDb } from "@/lib/ivyDb";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> } // 💡 타입을 Promise로 명시
) {
  try {
    const session = await getSession();
    
    // 💡 핵심: Next.js 15 규칙에 따라 params를 await로 먼저 풀어줍니다.
    const { courseId } = await params; 

    if (!session || !session.id || !session.tId) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    // 1. cojooboo 브랜드 분기
    if (session.brand === 'cojooboo') {
      const course = await cojoobooDb.course.findFirst({
        where: { id: courseId, teachers: { some: { id: session.tId } } }
      });

      if (!course) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

      // 💡 실제 48명만 나오도록 enrollments에서 courseId로 엄격하게 조회
      const enrollments = await cojoobooDb.enrollment.findMany({
        where: { courseId: courseId },
        include: { 
          user: { select: { id: true, username: true, email: true, avatar: true, phone: true } }, 
          courseOption: { select: { name: true } } 
        },
      });

      const userIds = enrollments.map((e) => e.userId);
      const totalLessons = await cojoobooDb.lesson.count({
        where: { chapter: { courseId }, isPublished: true },
      });

      const progressResults = await cojoobooDb.userProgress.groupBy({
        by: ['userId'],
        where: {
          lesson: { chapter: { courseId } },
          userId: { in: userIds },
          isCompleted: true,
        },
        _count: { lessonId: true },
      });

      const progressMap = new Map(
        progressResults.map((r) => [r.userId, totalLessons > 0 ? Math.round((r._count.lessonId / totalLessons) * 100) : 0])
      );

      return NextResponse.json({
        course,
        enrolledUsers: enrollments.map((e: any) => ({
          id: e.user?.id,
          username: e.user?.username || "알 수 없음",
          email: e.user?.email || "",
          avatar: e.user?.avatar,
          phone: e.user?.phone || "-",
          courseOption: e.courseOption?.name || "기본",
          progress: progressMap.get(e.userId) || 0,
          endDate: e.endDate,
          isActive: e.isActive,
        }))
      });
    }

    // 2. ivy 브랜드 분기
    if (session.brand === 'ivy') {
      const course = await ivyDb.course.findFirst({
        where: { id: courseId, teachers: { some: { id: session.tId } } }
      });

      if (!course) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

      const enrollments = await ivyDb.enrollment.findMany({
        where: { courseId: courseId },
        include: { 
          user: { select: { id: true, username: true, email: true, avatar: true, phone: true } }, 
          courseOption: { select: { name: true } } 
        },
      });

      const userIds = enrollments.map((e) => e.userId);
      const totalLessons = await ivyDb.lesson.count({
        where: { chapter: { courseId }, isPublished: true },
      });

      const progressResults = await ivyDb.userProgress.groupBy({
        by: ['userId'],
        where: {
          lesson: { chapter: { courseId } },
          userId: { in: userIds },
          isCompleted: true,
        },
        _count: { lessonId: true },
      });

      const progressMap = new Map(
        progressResults.map((r) => [r.userId, totalLessons > 0 ? Math.round((r._count.lessonId / totalLessons) * 100) : 0])
      );

      return NextResponse.json({
        course,
        enrolledUsers: enrollments.map((e: any) => ({
          id: e.user?.id,
          username: e.user?.username || "알 수 없음",
          email: e.user?.email || "",
          avatar: e.user?.avatar,
          phone: e.user?.phone || "-",
          courseOption: e.courseOption?.name || "기본",
          progress: progressMap.get(e.userId) || 0,
          endDate: e.endDate,
          isActive: e.isActive,
        }))
      });
    }

    return NextResponse.json({ error: "잘못된 브랜드 설정입니다." }, { status: 400 });

  } catch (e) {
    console.error('[GET_COURSE_DETAIL_ERROR]', e);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}