"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function UserDropdown() {
  const [user, setUser] = useState<{username: string, avatar: string} | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); 
  const [isOpen, setIsOpen] = useState(false);

 useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");


        if (res.status === 401 || res.status === 404) {
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("데이터 로드 실패");

        const data = await res.json();
        
        // 2. 응답은 성공했으나 데이터가 유효하지 않은 경우 처리
        if (!data || !data.username) {
          router.push("/login");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error("인증 확인 중 오류:", err);
        router.push("/login"); // 에러 발생 시에도 로그인으로 튕겨냄
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {

    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (!user) return null;

  return (
    <div 
        className="relative" 
        onMouseEnter={() => setIsOpen(true)} 
        onMouseLeave={() => setIsOpen(false)}
      >
          {/* 아바타와 이름 버튼 */}
          <button className="flex items-center gap-2">
            <div className="relative w-10 h-10 overflow-hidden rounded-full">
              <Image 
                src={user.avatar || "/default-avatar.png"} 
                alt="User Avatar" 
                fill 
                className="object-cover"
              />
            </div>
            <span className="hidden md:block text-sm font-medium">{user.username}님</span>
          </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full pt-2 w-48 z-50"
            >
              <div className="bg-white border rounded-md shadow-lg overflow-hidden">
                <div className="p-2 border-b">
              <p className="text-xs text-gray-500 truncate">{user.username} 님</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              로그아웃
            </button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}