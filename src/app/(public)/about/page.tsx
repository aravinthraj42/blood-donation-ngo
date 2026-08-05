import { Metadata } from "next";
import { getAllSettings } from "@/services/public";
import { Heart, Users, Target, Award, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about LifeBlood Foundation's mission to save lives through blood donation awareness and connecting donors with those in need.",
};

export const dynamic = 'force-dynamic';

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We believe in the power of human kindness and the gift of giving.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a network of caring individuals committed to saving lives.",
  },
  {
    icon: Target,
    title: "Accessibility",
    description: "Making blood donation accessible and straightforward for everyone.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Maintaining the highest standards in everything we do.",
  },
];

const milestones = [
  { number: "500+", label: "Registered Donors" },
  { number: "200+", label: "Lives Saved" },
  { number: "50+", label: "Partner Hospitals" },
  { number: "10+", label: "Years of Service" },
];

export default async function AboutPage() {
  const settings = await getAllSettings();
  const ngoName = settings.NGO_NAME || "LifeBlood Foundation";
  const ngoDescription = settings.NGO_DESCRIPTION || "";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About {ngoName}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {ngoDescription ||
                "We are a non-profit organization dedicated to saving lives through blood donation awareness and connecting donors with those in need. Every drop counts, and together, we can make a difference."}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our mission is to ensure that no one loses their life due to a
                  shortage of blood. We work tirelessly to connect blood donors
                  with patients in need, creating a bridge between generosity and
                  necessity.
                </p>
                <p>
                  We believe that blood donation is one of the most selfless acts
                  a person can do. A single donation can save up to three lives,
                  making every donor a hero in someone&apos;s story.
                </p>
                <p>
                  Through awareness campaigns, community outreach, and technology,
                  we aim to make the blood donation process seamless and
                  accessible for everyone.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {milestones.map((milestone) => (
                <Card key={milestone.label} className="text-center">
                  <CardContent className="pt-6">
                    <p className="text-4xl font-bold text-primary mb-2">
                      {milestone.number}
                    </p>
                    <p className="text-sm text-gray-600">{milestone.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and define who we are as
              an organization.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What We Do
            </h2>
            <div className="space-y-4">
              {[
                "Maintain a database of registered blood donors across the region",
                "Connect patients in need with compatible blood donors",
                "Organize regular blood donation camps and drives",
                "Spread awareness about the importance of blood donation",
                "Partner with hospitals and healthcare facilities",
                "Provide information and support to donors and recipients",
                "Recognize and appreciate our donor community",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-amber-50 border-y border-amber-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-semibold text-amber-900 mb-2">
              Important Information
            </h3>
            <p className="text-sm text-amber-800">
              {ngoName} facilitates connections between blood donors and
              recipients. Final medical eligibility for blood donation and
              transfusion is determined by qualified healthcare professionals.
              Always consult with medical professionals for healthcare decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
