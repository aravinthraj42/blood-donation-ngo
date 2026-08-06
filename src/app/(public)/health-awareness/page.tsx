import { Metadata } from "next";
import { getPublishedContent } from "@/services/public";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  Droplet,
  Heart,
  Lightbulb,
  Quote,
  Megaphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Health Awareness",
  description:
    "Stay informed with healthcare tips, doctor messages, and blood donation awareness content from Blood Connect – InfoPark News Initiate, Kochi.",
};

export const dynamic = 'force-dynamic';

const categoryConfig = [
  { value: "all", label: "All", icon: Heart },
  { value: "DOCTOR_MESSAGE", label: "Doctor's Message", icon: Stethoscope },
  { value: "BLOOD_DONATION", label: "Blood Donation", icon: Droplet },
  { value: "HEALTHCARE", label: "Healthcare", icon: Heart },
  { value: "AWARENESS", label: "Awareness", icon: Lightbulb },
  { value: "QUOTE", label: "Quotes", icon: Quote },
  { value: "ANNOUNCEMENT", label: "Announcements", icon: Megaphone },
];

const categoryColors: Record<string, string> = {
  DOCTOR_MESSAGE: "bg-blue-100 text-blue-700",
  BLOOD_DONATION: "bg-red-100 text-red-700",
  HEALTHCARE: "bg-green-100 text-green-700",
  AWARENESS: "bg-yellow-100 text-yellow-700",
  QUOTE: "bg-purple-100 text-purple-700",
  ANNOUNCEMENT: "bg-orange-100 text-orange-700",
};

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

export default async function HealthAwarenessPage() {
  const content = await getPublishedContent();

  const contentByCategory: Record<string, typeof content> = {
    all: content,
  };

  content.forEach((item) => {
    if (!contentByCategory[item.category]) {
      contentByCategory[item.category] = [];
    }
    contentByCategory[item.category].push(item);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Health Awareness
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Stay informed with the latest health tips, doctor&apos;s messages, and
            blood donation awareness content.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          {content.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Content Yet
              </h2>
              <p className="text-gray-600">
                Check back soon for health awareness content and updates.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent mb-8 justify-center">
                {categoryConfig.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    disabled={cat.value !== "all" && !contentByCategory[cat.value]?.length}
                  >
                    <cat.icon className="w-4 h-4 mr-2" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categoryConfig.map((cat) => (
                <TabsContent key={cat.value} value={cat.value}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(contentByCategory[cat.value] || []).map((item) => {
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
                                {categoryLabels[item.category]}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
}
