import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "강사전용관리페이지 로그인",

};

export default function SignUp() {
  return <LoginForm />;
}
