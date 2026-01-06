import { KakaoUser } from "@/app/types/kakao-user";
import { caDb } from "@/lib/caDb";
import { normalizeKRPhoneNumber } from "@/lib/formats";
import { UserLogin } from "@/lib/user-login";

import crypto from "crypto";
import { Faster_One } from "next/font/google";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

async function getToken(code: string) {
  const searchParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_IVY_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_APP_URL! + "/kakao/ivy/complete",
    code,
  }).toString();
  const response = await fetch(
    `https://kauth.kakao.com/oauth/token?${searchParams}`,
    {
      method: "POST",
      headers: {
        content_type: "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
  const { access_token } = await response.json();

  return access_token;
}

async function getUser(token: string) {
  const response = await fetch(`https://kapi.kakao.com/v2/user/me`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Content_type: "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  return await response.json();
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return new Response(null, { status: 400 });

  const redirectPath = req.nextUrl.searchParams.get("state");
  const redirectUrl = redirectPath
    ? decodeURIComponent(redirectPath)
    : "/";

  const token = await getToken(code);
  if (!token) return new Response("token not exists", { status: 400 });

  const userData: KakaoUser = await getUser(token);
  if (!userData) return new Response("user not exists", { status: 404 });

  const kakaoId = userData.id + "";
  const kakaoName = userData.kakao_account?.name;
  const kakaoNickname = userData.kakao_account?.profile?.nickname;
  const kakaoEmail = userData.kakao_account?.email;
  const kakaoPhone = userData.kakao_account?.phone_number;
  const kakaoProfileImg = userData.kakao_account?.profile?.thumbnail_image_url;

  const phoneNumber = kakaoPhone ? normalizeKRPhoneNumber(kakaoPhone) : null;

  const existingUser = await caDb.teacher.findUnique({
    where: {
      kakaoId,
      brand: 'ivy'
    },
    select: {
      id: true,
      isRegist: true
    },
  });

  if (existingUser) {
    if (existingUser.isRegist) {
      const user = await caDb.teacher.update({
        where: { id: existingUser.id },
        data: {
          username: kakaoName,
          email: kakaoEmail,
          phone: phoneNumber,
          avatar: kakaoProfileImg,
        },
        select: { id: true },
      });
      return await UserLogin(user.id, 'ivy', redirectUrl);
    } 
    else {
      return redirect(`/signup-complete?redirectUrl=${redirectUrl}&status=pending`);
    }
  }

  const ckeckKakaoUser = await caDb.teacher.findUnique({
    where: {
      kakaoId,
      isRegist : true,
      brand : 'ivy'
    },
    select: {
      id: true,
    },
  });
  if (ckeckKakaoUser) {
    const user = await caDb.teacher.update({
      where: {
        kakaoId,
        brand : 'ivy'
      },
      data: {
        username: kakaoName,
        email: kakaoEmail,
        phone: phoneNumber,
        avatar: kakaoProfileImg,
      },
      select: {
        id: true,
        brand : true,
      },
    });

    return await UserLogin(user.id, 'brand', redirectUrl);
  }

  const checkEmail = kakaoEmail ? await caDb.teacher.findFirst({
    where: { email: kakaoEmail, isRegist: true }, 
    select: { id: true },
  }) : null;

  if (checkEmail) {
    const user = await caDb.teacher.update({
      where: {
        id: checkEmail.id,
        isRegist : true,
      },
      data: {
        username: kakaoName,
        avatar: kakaoProfileImg,
      },
      select: {
        id: true,
        brand : true,
      },
    });

    return await UserLogin(user.id, 'ivy', redirectUrl);
  }

  // 최종적으로 유저 생성
  const user = await caDb.teacher.create({
    data: {
      kakaoId,
      username: kakaoName || `kakao-${crypto.randomBytes(6).toString("hex")}`,
      nickname:
        kakaoNickname || `kakao-${crypto.randomBytes(6).toString("hex")}`,
      email: kakaoEmail,
      avatar: kakaoProfileImg || "",
      phone: phoneNumber,
      brand : 'ivy',
      updatedAt : new Date(),
    },
    select: {
      id: true,
    },
  });

  return redirect(
    `/signup-complete?redirectUrl=${redirectUrl}`
  );
}
