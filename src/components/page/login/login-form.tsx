'use client';

import kakaoIcon from '@/../public/kakao-icon.svg';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
    videoUrl?: string | null;
}

export default function LoginForm({ videoUrl }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onKakao = () => {
        setIsLoading(true);
        requestAnimationFrame(() => {
            router.push('/kakao/start');
        });
    };

    return (
        <div className="space-y-8 md:space-y-10 lg:space-y-12">
            <div className="space-y-2 md:space-y-4 text-center">
                <h1 className="font-nexonWarhaven text-3xl md:text-4xl lg:text-5xl">
                    로그인/회원가입
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-foreground/80">
                    1초 가입하고
                    <br />
                    다양한 무료 혜택을 받으세요
                </p>
            </div>
            <KakaoButton isLoading={isLoading} onKakao={onKakao} />
        </div>
    );
}

function KakaoButton({ isLoading, onKakao }: { isLoading: boolean; onKakao: () => void }) {
    return (
        <button
            onClick={onKakao}
            disabled={isLoading}
            className={cn(
                'px-8 md:px-10 py-4 md:py-6 w-full flex items-center justify-center rounded-xl md:rounded-2xl bg-[#F8DB70] text-[#392020] gap-x-3',
                'disabled:bg-foreground/20 disabled:text-foreground/40 disabled:cursor-not-allowed'
            )}
        >
            <div className="relative aspect-square size-5 md:size-8">
                <Image
                    fill
                    src={kakaoIcon}
                    alt="kakao icon"
                    className={cn(isLoading && 'opacity-50')}
                />
            </div>
            <span className="text-lg md:text-xl lg:text-2xl font-semibold">
                {isLoading ? '카카오톡 로그인 중...' : '카카오톡으로 3초만에 시작하기'}
            </span>
            {isLoading && <Loader2 className="size-5 stroke-[3px] animate-spin" />}
        </button>
    );
}
