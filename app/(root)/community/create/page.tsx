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
import CommunityClientService from "@/db/services/client/community.service";
import { type CommunityCreateData } from "@/db/services/validators/community.validator";
import sendToastEvent from "@/utils/sendToastEvent";
import { useRouter } from "next/navigation";
import useUploadFile from "@/hooks/useUploadFile";

const useCreateCommunity = (data: CommunityCreateData) => {
  const router = useRouter();
  const { mutate: createCommunity, isPending } = useMutation({
    mutationKey: ["createCommunity"],
    mutationFn: () => CommunityClientService.createCommunity(data),
    onSuccess: (data) => {
      sendToastEvent({
        title: "Success",
        description: "Community Created",
      });

      setTimeout(() => router.push(`/community/${data.community.id}`), 2000);
    },
    onError: (error: Error) => {
      sendToastEvent({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { createCommunity, isPending };
};

export default function CreateCommunityForm() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const [image, setProfileImage] = useState<string>();
  const [banner, setBannerImage] = useState<string>();
  const { uploadFile, isUploading } = useUploadFile();

  const { createCommunity, isPending } = useCreateCommunity({
    name: name || "",
    banner: banner,
    bio: description as string,
    image: image as string,
  });

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFile(file);
      setProfileImage(url);
    }
  };

  const handleBannerImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFile(file);
      setBannerImage(url);
    }
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
              disabled={isUploading}
            />
          </div>
          <div>
            <Label htmlFor="bannerImage">Banner Image</Label>
            <Input
              id="bannerImage"
              type="file"
              accept="image/*"
              onChange={handleBannerImageChange}
              disabled={isUploading}
            />
          </div>
          <Button
            type="button"
            onClick={() => createCommunity()}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Community"}
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
              <div className="relative w-24 h-24 rounded-lg ml-2 overflow-hidden bg-gray-200 -mt-12 ring-background ring-offset-transparent ring-4">
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
