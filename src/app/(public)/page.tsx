import { Metadata } from "next";
import { HeroSection, CTASection } from "@/components/public/hero-section";
import { BloodAvailabilitySection } from "@/components/public/blood-availability";
import { ContentSection } from "@/components/public/content-section";
import { getPublicBloodAvailability, getPublishedContent } from "@/services/public";

export const metadata: Metadata = {
  title: "LifeBlood Foundation - Donate Blood, Save Lives",
  description:
    "Join LifeBlood Foundation in our mission to save lives through blood donation. Register as a donor, request blood, and learn about the importance of blood donation.",
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [availability, content] = await Promise.all([
    getPublicBloodAvailability(),
    getPublishedContent(undefined, 6),
  ]);

  return (
    <>
      <HeroSection />
      <BloodAvailabilitySection availability={availability} />
      <ContentSection content={content} />
      <CTASection />
    </>
  );
}
