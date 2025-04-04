"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import createCommunity from "@/features/community/api/createCommunity";

export default function CreateCommunityForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setProfileImage] = useState<string | null>(null);
  const [banner, setBannerImage] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("File upload failed");
    return response.json();
  };

  const profileUploadMutation = useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: (data) => {
      setProfileImage(data.url);
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: "Profile image uploaded",
            variant: "default",
          },
        }),
      );
    },
    onError: (error: Error) => {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            variant: "destructive",
            title: "Upload Error",
            description: error.message,
          },
        }),
      );
    },
  });

  const bannerUploadMutation = useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: (data) => {
      setBannerImage(data.url);
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: "Banner image uploaded",
            variant: "default",
          },
        }),
      );
    },
    onError: (error: Error) => {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            variant: "destructive",
            title: "Upload Error",
            description: error.message,
          },
        }),
      );
    },
  });

  const createCommunityMutation = useMutation({
    mutationFn: () =>
      createCommunity({
        name,
        banner: banner as string | undefined,
        bio: description,
        image: image as string | undefined,
      }),
    onSuccess: () => {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: "Community Created",
            variant: "default",
          },
        }),
      );
    },
    onError: (error: Error) => {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            variant: "destructive",
            title: "Error",
            description: error.message,
          },
        }),
      );
    },
  });

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) profileUploadMutation.mutate(file);
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) bannerUploadMutation.mutate(file);
  };

  return (
    <div className="border border-muted rounded-xl">
      <div className="py-2 border-b border-muted">
        <Link href="/" className="flex items-center gap-3 px-3 py-2">
          <GoArrowLeft />
          Return
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-rows-2">
        <form className="space-y-6 p-3">
          <div>
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="profileImage">Profile Image</Label>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              disabled={profileUploadMutation.isPending}
            />
          </div>
          <div>
            <Label htmlFor="bannerImage">Banner Image</Label>
            <Input
              id="bannerImage"
              type="file"
              accept="image/*"
              onChange={handleBannerImageChange}
              disabled={bannerUploadMutation.isPending}
            />
          </div>
          <Button
            type="button"
            onClick={() => createCommunityMutation.mutate()}
            disabled={createCommunityMutation.isPending}
          >
            {createCommunityMutation.isPending
              ? "Creating..."
              : "Create Community"}
          </Button>
        </form>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Community Preview</h2>
          <div className="space-y-4">
            <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
              {banner ? (
                <Image
                  src={banner}
                  alt="Community banner"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Banner Image
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-xl ml-2 overflow-hidden bg-gray-200 -mt-12 ring-background ring-offset-transparent ring-4">
                {image ? (
                  <Image
                    src={image}
                    alt="Community profile"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Profile
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">
                  {name || "Community Name"}
                </h3>
                <p className="text-gray-600 text-xs">
                  {description || "Community description will appear here"}
                </p>
                <p className="text-gray-600 text-xs">
                  Date Created {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
