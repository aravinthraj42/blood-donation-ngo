import { Droplet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BloodAvailability } from "@/types";

interface BloodAvailabilityProps {
  availability: BloodAvailability;
}

const bloodGroupColors: Record<string, string> = {
  "A+": "bg-red-50 border-red-100",
  "A-": "bg-red-50 border-red-100",
  "B+": "bg-blue-50 border-blue-100",
  "B-": "bg-blue-50 border-blue-100",
  "O+": "bg-green-50 border-green-100",
  "O-": "bg-green-50 border-green-100",
  "AB+": "bg-purple-50 border-purple-100",
  "AB-": "bg-purple-50 border-purple-100",
};

export function BloodAvailabilitySection({ availability }: BloodAvailabilityProps) {
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Blood Availability
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Current registered eligible donors by blood group. Connect with our
            team to find a matching donor for your needs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {bloodGroups.map((group) => (
            <Card
              key={group}
              className={`${bloodGroupColors[group]} border-2 hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-4 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
                  <Droplet className="w-5 h-5 text-primary" fill="currentColor" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{group}</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {availability[group] ?? 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Available</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
          <strong>Disclaimer:</strong> Availability shown is based on registered
          donor information and does not replace medical screening or
          confirmation by healthcare providers.
        </p>
      </div>
    </section>
  );
}
