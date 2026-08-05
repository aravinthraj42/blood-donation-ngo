"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { updateSettings } from "@/actions/admin-settings";
import { toast } from "sonner";

interface SettingsFormProps {
  settings: Record<string, string>;
  isSuperAdmin: boolean;
}

export function SettingsForm({ settings, isSuperAdmin }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(settings);
  const router = useRouter();

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateSettings(formData);
      if (result.success) {
        toast.success("Settings updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* NGO Information */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Basic information about your NGO displayed on the public website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="NGO_NAME">Organization Name</Label>
              <Input
                id="NGO_NAME"
                value={formData.NGO_NAME || ""}
                onChange={(e) => handleChange("NGO_NAME", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="NGO_LOGO">Logo URL</Label>
              <Input
                id="NGO_LOGO"
                value={formData.NGO_LOGO || ""}
                onChange={(e) => handleChange("NGO_LOGO", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="NGO_DESCRIPTION">Description</Label>
            <Textarea
              id="NGO_DESCRIPTION"
              value={formData.NGO_DESCRIPTION || ""}
              onChange={(e) => handleChange("NGO_DESCRIPTION", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Contact details displayed on the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="CONTACT_PHONE">Phone Number</Label>
              <Input
                id="CONTACT_PHONE"
                value={formData.CONTACT_PHONE || ""}
                onChange={(e) => handleChange("CONTACT_PHONE", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="CONTACT_EMAIL">Email Address</Label>
              <Input
                id="CONTACT_EMAIL"
                type="email"
                value={formData.CONTACT_EMAIL || ""}
                onChange={(e) => handleChange("CONTACT_EMAIL", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ADDRESS">Address</Label>
            <Textarea
              id="ADDRESS"
              value={formData.ADDRESS || ""}
              onChange={(e) => handleChange("ADDRESS", e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="CITY">City</Label>
              <Input
                id="CITY"
                value={formData.CITY || ""}
                onChange={(e) => handleChange("CITY", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="STATE">State</Label>
              <Input
                id="STATE"
                value={formData.STATE || ""}
                onChange={(e) => handleChange("STATE", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Social media profile links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="SOCIAL_FACEBOOK">Facebook</Label>
              <Input
                id="SOCIAL_FACEBOOK"
                value={formData.SOCIAL_FACEBOOK || ""}
                onChange={(e) => handleChange("SOCIAL_FACEBOOK", e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="SOCIAL_TWITTER">Twitter / X</Label>
              <Input
                id="SOCIAL_TWITTER"
                value={formData.SOCIAL_TWITTER || ""}
                onChange={(e) => handleChange("SOCIAL_TWITTER", e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="SOCIAL_INSTAGRAM">Instagram</Label>
              <Input
                id="SOCIAL_INSTAGRAM"
                value={formData.SOCIAL_INSTAGRAM || ""}
                onChange={(e) => handleChange("SOCIAL_INSTAGRAM", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings - Super Admin Only */}
      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Advanced settings that affect system behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="DONATION_ELIGIBILITY_INTERVAL_DAYS">
                  Donation Eligibility Interval (days)
                </Label>
                <Input
                  id="DONATION_ELIGIBILITY_INTERVAL_DAYS"
                  type="number"
                  min={30}
                  max={180}
                  value={formData.DONATION_ELIGIBILITY_INTERVAL_DAYS || "90"}
                  onChange={(e) =>
                    handleChange("DONATION_ELIGIBILITY_INTERVAL_DAYS", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500">
                  Number of days between donations for eligibility calculation
                </p>
              </div>
              <div className="space-y-2">
                <Label>Public Blood Availability</Label>
                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    checked={formData.PUBLIC_BLOOD_AVAILABILITY_ENABLED === "true"}
                    onCheckedChange={(checked) =>
                      handleChange(
                        "PUBLIC_BLOOD_AVAILABILITY_ENABLED",
                        checked ? "true" : "false"
                      )
                    }
                  />
                  <span className="text-sm text-gray-600">
                    Show blood availability on public website
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
