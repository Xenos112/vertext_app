"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import useUserStore from "@/store/user";
import getUserById from "../api/getUserById";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useUpload } from "@/hooks/useUpload";
import Image from "next/image";
import updateUserProfile from "../api/updateUserProfile";
import { UserProfileUpdateSchemaValidatorType } from "../validators";

// FIX: need a user fetcher in the user page layout
// FIX: The user banner image is uploaded but not applied in the first try
// TODO: let the user update the user tag
export default function EditProfileModal() {
  const userData = useUserStore((state) => state.user);
  const { data: user } = useQuery({
    queryKey: ["user", userData?.id],
    queryFn: () => getUserById(userData!.id!),
  });
  const [newUserData, setNewUserData] = useState(user);
  const { url, upload } = useUpload();
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const bannerImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNewUserData(user);
  }, [user]);

  const upladBannerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;
    const bannerUrl = await upload(image);
    setNewUserData((prev) => ({ ...prev!, banner_url: bannerUrl }));
  };

  const uploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;
    const imageUrl = await upload(image);
    console.log(url);
    setNewUserData((prev) => ({ ...prev!, image_url: imageUrl }));
  };

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationKey: ["user", userData?.id],
    mutationFn: () =>
      updateUserProfile(newUserData as UserProfileUpdateSchemaValidatorType),
    onError: () => {
      console.log("ERROR_USER_UPDATE");
    },
  });

  if (!user) return;
  return (
    <DialogContent>
      <DialogTitle>Edit Your Profile</DialogTitle>
      <div>
        <div
          onClick={() => bannerImageInputRef.current?.click()}
          className="w-full h-40 bg-gray-200 rounded-lg relative"
        >
          {newUserData?.banner_url ? (
            <Image
              src={newUserData!.banner_url}
              alt="banner"
              fill
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center h-full" />
          )}
        </div>
        <Avatar
          onClick={() => profileImageInputRef.current?.click()}
          className="size-24 ring-4 ring-muted -translate-y-1/2 mx-2"
        >
          {newUserData?.image_url ? (
            <AvatarImage className="size-24" src={newUserData!.image_url} />
          ) : null}
          <AvatarFallback className="size-24">
            {formatUserNameForImage(user.user_name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <Input
        placeholder="Name"
        onChange={(e) =>
          setNewUserData((prev) => ({ ...prev!, user_name: e.target.value }))
        }
        value={newUserData?.user_name || "Helo"}
      />
      <Textarea
        placeholder="Bio"
        rows={4}
        onChange={(e) =>
          setNewUserData((prev) => ({ ...prev!, bio: e.target.value }))
        }
        value={newUserData?.bio || ""}
      />
      <DialogFooter className="flex gap-4">
        <DialogClose>Cancel</DialogClose>
        <Button onClick={() => updateUser()} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </DialogFooter>
      <input
        ref={profileImageInputRef}
        className="hidden"
        type="file"
        multiple={false}
        accept="image/*"
        onChange={uploadProfileImage}
      />
      <input
        ref={bannerImageInputRef}
        className="hidden"
        type="file"
        multiple={false}
        accept="image/*"
        onChange={upladBannerImage}
      />
    </DialogContent>
  );
}
