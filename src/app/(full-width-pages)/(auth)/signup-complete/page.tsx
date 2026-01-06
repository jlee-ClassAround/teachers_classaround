"use client";

import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SignupComplete() {
  const searchParams = useSearchParams();
  const isPending = searchParams.get("status") === "pending";

  return (
    <div className="flex lg:w-1/2 flex-col items-center justify-center bg-background w-full h-full min-h-screen text-center p-6">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="mb-6 flex justify-center">
          {isPending ? (
            <Clock className="w-20 h-20 text-amber-500 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-in zoom-in duration-500" />
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-4 text-slate-900">
          {isPending ? "가입 승인 처리 중입니다" : "가입 신청이 완료되었습니다!"}
        </h1>
        
        <p className="text-base text-slate-500 mb-10 leading-relaxed">
          {isPending 
            ? "이미 가입 신청이 접수되어 관리자가 확인 중입니다. 승인이 완료되면 별도로 안내해 드리겠습니다."
            : "관리자의 승인 후 서비스를 이용하실 수 있습니다. 잠시만 기다려 주세요."}
        </p>

        <Link
          href="/login"
          className="w-full max-w-[280px] inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95"
        >
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}