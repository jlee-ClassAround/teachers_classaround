import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/session';

export default async function middleware(req: NextRequest) {
   
    const session = await getSession();
    const isLoggedIn = Boolean(session.id);


    if (!isLoggedIn) {
        const loginUrl = new URL('/login');
        return NextResponse.redirect(loginUrl);
    }


}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.html$).*)',
    ],
};
