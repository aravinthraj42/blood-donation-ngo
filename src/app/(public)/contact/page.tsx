import { Metadata } from "next";
import { getAllSettings } from "@/services/public";
import { DEFAULT_SETTINGS } from "@/config/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Blood Connect – InfoPark News Initiate, Kochi. We're here to help with blood donation queries, requests, and partnerships.",
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getAllSettings();

  const phone = settings.CONTACT_PHONE || DEFAULT_SETTINGS.CONTACT_PHONE;
  const email = settings.CONTACT_EMAIL || DEFAULT_SETTINGS.CONTACT_EMAIL;
  const address = settings.ADDRESS || DEFAULT_SETTINGS.ADDRESS;
  const city = settings.CITY || DEFAULT_SETTINGS.CITY;
  const state = settings.STATE || DEFAULT_SETTINGS.STATE;

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: MapPin,
      label: "Address",
      value: `${address}, ${city}, ${state}`,
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon - Sat: 9:00 AM - 6:00 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Have questions or need assistance? We&apos;re here to help. Reach out
            to us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
              <p className="text-gray-600">
                Whether you have questions about blood donation, need to request
                blood, or want to partner with us, we&apos;d love to hear from you.
              </p>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <Card key={info.label}>
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="font-medium text-gray-900 hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium text-gray-900">{info.value}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Emergency Notice */}
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-1">
                  For Emergencies
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  If you have an urgent blood requirement, please call us directly
                  or submit a blood request through our website.
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center text-sm font-medium text-red-700 hover:text-red-800"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Send us a Message
                  </h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
