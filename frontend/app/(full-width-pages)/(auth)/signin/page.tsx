import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page | Master-tools",
  description: "This is Next.js Signin Page for Master-tools",
};

export default function SignIn() {
  return <SignInForm />;
}
