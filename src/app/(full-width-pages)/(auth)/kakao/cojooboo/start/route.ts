export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const redirectData = searchParams.get("redirect") ?? "/";



  const client_id = process.env.KAKAO_COJOOBOO_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_APP_URL! +"/kakao/cojooboo/complete";

  const kakaoParams = new URLSearchParams({
    client_id: client_id ?? '',
    redirect_uri: redirectUri,
    response_type: "code",
  });
  console.log(kakaoParams)
  return Response.redirect(
    `https://kauth.kakao.com/oauth/authorize?${kakaoParams.toString()}`
  );
}
