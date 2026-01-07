import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { caDb } from "@/lib/caDb";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    // DB에서 최신 유저 정보 조회 (아바타, 이름 등)
    const user = await caDb.teacher.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        tId: true,
        avatar: true,
        brand: true, 
        username:true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}