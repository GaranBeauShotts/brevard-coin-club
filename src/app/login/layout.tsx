import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to access member features and post classifieds.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
