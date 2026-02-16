import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classifieds",
  description:
    "Browse, search, and post coin listings in the Brevard Coin Club marketplace.",
};

export default function ClassifiedsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
