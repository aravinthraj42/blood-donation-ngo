import { Metadata } from "next";
import { BloodRequestForm } from "@/components/forms/blood-request-form";
import { getBloodGroups } from "@/services/public";
import { Phone, Clock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Request Blood",
  description:
    "Submit a blood request through LifeBlood Foundation. We connect patients with registered blood donors for life-saving transfusions.",
};

export const dynamic = 'force-dynamic';

export default async function RequestBloodPage() {
  const bloodGroups = await getBloodGroups();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Request Blood
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Submit your blood requirement and our team will help connect you
            with registered donors.
          </p>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">For Emergencies</h3>
                <p className="text-sm text-red-700">
                  Call our emergency line directly for immediate assistance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Call Us</h3>
                <p className="text-sm text-blue-700">
                  <a href="tel:+911234567890" className="font-medium">
                    +91 1234567890
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Response Time</h3>
                <p className="text-sm text-green-700">
                  We typically respond within 30 minutes to 2 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <BloodRequestForm bloodGroups={bloodGroups} />
        </div>
      </section>
    </div>
  );
}
