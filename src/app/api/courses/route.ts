import { caDb } from "@/lib/caDb";
import { cojoobooDb } from "@/lib/cojoobooDb";
import { ivyDb } from "@/lib/ivyDb";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const session = await getSession();
        if (!session || !session.id || !session.tId) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    if (session.brand === 'cojooboo') {
      const courses = await cojoobooDb.course.findMany({
        where: {
          teachers: {
            some: {
              id: session.tId,
            },
          },
        },
        include: {
          teachers: {
            select: {
              id: true,
            },
          },
          enrollments: {
            where: {
              role: null,
            },
            select: {
              id: true, 
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const formattedCourses = courses.map((course) => ({
        ...course,
        _count: {
          enrollments: course.enrollments.length, 
        },
        enrollments: undefined, 
      }));

      return NextResponse.json(formattedCourses);

    }else{
        const courses = await ivyDb.course.findMany({
          where: {
            teachers: {
              some: {
                id: session.tId, 
              },
            },
          },
          include: {
            teachers: {
              select: {
                id: true,

              }
            },
            _count: {
              select: { enrollments: true } 
            }
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        return NextResponse.json(courses);
    }

    

    }catch(e){
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}