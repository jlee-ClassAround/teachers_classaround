import { KakaoUser } from "@/app/types/kakao-user";
import { ivyDb } from "@/lib/ivyDb";
import { normalizeKRPhoneNumber } from "@/lib/formats";
import { UserLogin } from "@/lib/user-login";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

async function getToken(code: string) {
  const searchParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_ivy_CLIENT_ID!,
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
    : "/mypage";

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

  const ckeckKakaoUser = await ivyDb.user.findUnique({
    where: {
      kakaoId,
    },
    select: {
      id: true,
    },
  });
  if (ckeckKakaoUser) {
    // 카카오 회원가입을 이미 했을 때
    const user = await ivyDb.user.update({
      where: {
        kakaoId,
      },
      data: {
        username: kakaoName,
        email: kakaoEmail,
        phone: phoneNumber,
        avatar: kakaoProfileImg,
      },
      select: {
        id: true,
      },
    });

    return await UserLogin(user.id, redirectUrl);
    // Redirect
  }

  const checkEmail = kakaoEmail
    ? await ivyDb.user.findUnique({
        where: {
          email: kakaoEmail,
        },
        select: {
          id: true,
        },
      })
    : null;
  if (checkEmail) {
    const user = await ivyDb.user.update({
      where: {
        id: checkEmail.id,
      },
      data: {
        username: kakaoName,
        avatar: kakaoProfileImg,
      },
      select: {
        id: true,
      },
    });

    return await UserLogin(user.id, redirectUrl);
  }

  // 최종적으로 유저 생성
  const user = await ivyDb.user.create({
    data: {
      kakaoId,
      username: kakaoName || `kakao-${crypto.randomBytes(6).toString("hex")}`,
      nickname:
        kakaoNickname || `kakao-${crypto.randomBytes(6).toString("hex")}`,
      email: kakaoEmail,
      avatar: kakaoProfileImg || "",
      phone: phoneNumber,
    },
    select: {
      id: true,
    },
  });

  await UserLogin(user.id);
  return redirect(
    `/signup-complete?redirectUrl=${redirectUrl}&userId=${user.id}`
  );
}
