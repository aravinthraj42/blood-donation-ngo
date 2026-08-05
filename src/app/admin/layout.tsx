import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin - LifeBlood Foundation",
    default: "Admin Dashboard | LifeBlood Foundation",
  },
  description: "Admin dashboard for managing blood donations",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
