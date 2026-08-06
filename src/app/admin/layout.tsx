import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin - Blood Connect",
    default: "Admin Dashboard | Blood Connect",
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
