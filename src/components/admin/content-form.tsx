"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createContent, updateContent } from "@/actions/admin-content";
import { toast } from "sonner";

const contentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  category: z.enum([
    "DOCTOR_MESSAGE",
    "BLOOD_DONATION",
    "HEALTHCARE",
    "AWARENESS",
    "QUOTE",
    "ANNOUNCEMENT",
  ]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishAt: z.string().optional(),
});

type ContentInput = z.infer<typeof contentSchema>;

interface ContentFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    category: string;
    status: string;
    publishAt: Date | null;
  };
}

export function ContentForm({ initialData }: ContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentInput>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      category: (initialData?.category as ContentInput["category"]) || "BLOOD_DONATION",
      status: (initialData?.status as ContentInput["status"]) || "DRAFT",
      publishAt: initialData?.publishAt
        ? new Date(initialData.publishAt).toISOString().slice(0, 16)
        : "",
    },
  });

  const onSubmit = async (data: ContentInput) => {
    setIsSubmitting(true);

    try {
      const result = initialData
        ? await updateContent(initialData.id, data)
        : await createContent(data);

      if (result.success) {
        toast.success(initialData ? "Content updated" : "Content created");
        router.push("/admin/content");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save content");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Content" : "New Content"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://..."
              {...register("imageUrl")}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select<string>
                defaultValue={watch("category")}
                onValueChange={(value) =>
                  value && setValue("category", value as ContentInput["category"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCTOR_MESSAGE">Doctor&apos;s Message</SelectItem>
                  <SelectItem value="BLOOD_DONATION">Blood Donation</SelectItem>
                  <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                  <SelectItem value="AWARENESS">Awareness</SelectItem>
                  <SelectItem value="QUOTE">Quote</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select<string>
                defaultValue={watch("status")}
                onValueChange={(value) =>
                  value && setValue("status", value as ContentInput["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishAt">Publish Date</Label>
            <Input
              id="publishAt"
              type="datetime-local"
              {...register("publishAt")}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : initialData ? (
                "Update Content"
              ) : (
                "Create Content"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
