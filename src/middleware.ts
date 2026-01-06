import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/session';

export default async function middleware(req: NextRequest) {
 const session = await getSession();
    const isLoggedIn = Boolean(session.id);
    const { pathname } = req.nextUrl;

    // 공개 경로 리스트 (정확한 매칭을 위해 startsWith 사용)
    const publicPaths = ['/login', '/kakao', '/signup-complete'];
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // 1. 로그인이 안 된 상태에서 비공개 경로 접근 시
    if (!isLoggedIn && !isPublicPath) {
        // 메인 페이지('/')를 포함하여 인증이 필요한 모든 곳은 로그인으로
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 2. 이미 로그인된 사용자가 로그인 페이지에 접속 시 메인으로
    if (isLoggedIn && pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();

}

export const config = {
    matcher: [
'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',    ],
};
