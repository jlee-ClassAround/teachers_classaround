import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {

    (await cookies()).delete("Session");

    return NextResponse.json({ message: "성공적으로 로그아웃되었습니다." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "로그아웃 중 오류가 발생했습니다." }, { status: 500 });
  }
}