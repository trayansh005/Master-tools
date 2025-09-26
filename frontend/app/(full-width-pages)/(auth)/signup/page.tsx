import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | Master-tools",
  description: "This is Next.js SignUp Page for Master-tools",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
