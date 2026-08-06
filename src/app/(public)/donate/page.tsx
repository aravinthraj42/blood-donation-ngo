import { Metadata } from "next";
import { DonorRegistrationForm } from "@/components/forms/donor-registration-form";
import { getBloodGroups } from "@/services/public";
import { Heart, Shield, Clock, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Become a Blood Donor",
  description:
    "Register as a blood donor with Blood Connect – InfoPark News Initiate, Kochi. Your donation can save up to 3 lives. Join our community of heroes today.",
};

export const dynamic = 'force-dynamic';

const benefits = [
  {
    icon: Heart,
    title: "Save Lives",
    description: "Your single donation can save up to 3 lives.",
  },
  {
    icon: Shield,
    title: "Free Health Check",
    description: "Get a mini health screening before each donation.",
  },
  {
    icon: Clock,
    title: "Quick Process",
    description: "The entire donation process takes only 30-45 minutes.",
  },
  {
    icon: Users,
    title: "Join Community",
    description: "Be part of a caring community making a difference.",
  },
];

export default async function DonatePage() {
  const bloodGroups = await getBloodGroups();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Become a Blood Donor
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Join our community of life-savers. Your blood donation can give
            someone another chance at life.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <DonorRegistrationForm bloodGroups={bloodGroups} />
        </div>
      </section>
    </div>
  );
}
