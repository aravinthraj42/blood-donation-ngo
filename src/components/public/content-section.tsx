import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Droplet, 
  Heart, 
  Lightbulb, 
  Quote, 
  Megaphone 
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  publishAt: Date | null;
}

interface ContentSectionProps {
  content: ContentItem[];
  title?: string;
  description?: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  DOCTOR_MESSAGE: Stethoscope,
  BLOOD_DONATION: Droplet,
  HEALTHCARE: Heart,
  AWARENESS: Lightbulb,
  QUOTE: Quote,
  ANNOUNCEMENT: Megaphone,
};

const categoryLabels: Record<string, string> = {
  DOCTOR_MESSAGE: "Doctor's Message",
  BLOOD_DONATION: "Blood Donation",
  HEALTHCARE: "Healthcare",
  AWARENESS: "Awareness",
  QUOTE: "Quote",
  ANNOUNCEMENT: "Announcement",
};

const categoryColors: Record<string, string> = {
  DOCTOR_MESSAGE: "bg-blue-100 text-blue-700",
  BLOOD_DONATION: "bg-red-100 text-red-700",
  HEALTHCARE: "bg-green-100 text-green-700",
  AWARENESS: "bg-yellow-100 text-yellow-700",
  QUOTE: "bg-purple-100 text-purple-700",
  ANNOUNCEMENT: "bg-orange-100 text-orange-700",
};

export function ContentSection({
  content,
  title = "Health & Awareness",
  description = "Stay informed with the latest health tips, doctor's messages, and blood donation awareness content.",
}: ContentSectionProps) {
  if (content.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const Icon = categoryIcons[item.category] || Heart;

            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                {item.imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className={item.imageUrl ? "p-5" : "p-6"}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      className={categoryColors[item.category]}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {categoryLabels[item.category] || item.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
