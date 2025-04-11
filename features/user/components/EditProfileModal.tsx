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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/store/user";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useUpload } from "@/hooks/useUpload";
import Image from "next/image";
import UserClientService from "@/db/services/client/user.service";
import type { UserUpdateData } from "@/db/services/validators/user.validator";
import sendToastEvent from "@/utils/sendToastEvent";

const useUserUpdate = (userId: string, data: UserUpdateData) => {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationKey: ["me"],
    mutationFn: () => UserClientService.updateUser(data),
    onError(error) {
      sendToastEvent({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user", userId],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: ["me"] });

      sendToastEvent({
        title: "Success",
        description: "User updated successfully",
      });
      document.dispatchEvent(new CustomEvent("close-edit-modal"));
    },
  });
  return { updateUser, isUpdating };
};

// FIX: The user banner image is uploaded but not applied in the first try
export default function EditProfileModal() {
  const userData = useUserStore((state) => state.user);
  const [newUserData, setNewUserData] = useState<UserUpdateData>({});
  const { url, upload } = useUpload();
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const bannerImageInputRef = useRef<HTMLInputElement>(null);
  const closeModalRef = useRef<HTMLButtonElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const { data: user } = useQuery({
    queryKey: ["user", userData?.id],
    queryFn: () => UserClientService.getUser(userData!.id),
  });

  const disableUpdateButton =
    userData?.user_name === newUserData.user_name &&
    userData?.tag === newUserData.tag &&
    userData?.bio === newUserData.bio &&
    userData?.image_url === newUserData.image_url &&
    userData?.banner_url === newUserData.banner_url;

  useEffect(() => {
    setNewUserData({
      user_name: user?.user_name,
      bio: user?.bio,
      image_url: user?.image_url,
      banner_url: user?.banner_url,
      tag: user?.tag,
    });
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

  const { updateUser, isUpdating } = useUserUpdate(userData!.id, {
    user_name: newUserData?.user_name,
    bio: newUserData?.bio,
    image_url: newUserData?.image_url,
    banner_url: newUserData?.banner_url,
    tag: newUserData?.tag,
  });

  useEffect(() => {
    document.addEventListener("close-edit-modal", () => {
      closeModalRef.current?.click();
    });

    document.addEventListener("keypress", (e) => {
      if (
        e.key === "Enter" &&
        modelRef.current?.contains(document.activeElement)
      ) {
        updateUser();
      }
    });

    return () => {
      document.removeEventListener("close-edit-modal", () => {
        closeModalRef.current?.click();
      });
      document.removeEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          updateUser();
        }
      });
    };
  }, []);

  if (!user) return;
  return (
    <DialogContent ref={modelRef}>
      <DialogTitle>Edit Your Profile</DialogTitle>
      <div>
        <div
          onClick={() => bannerImageInputRef.current?.click()}
          className="w-full h-40 bg-primary rounded-lg relative"
        >
          {newUserData?.banner_url ? (
            <Image
              src={newUserData!.banner_url}
              alt="banner"
              fill
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="flex justify-center items-center h-full" />
          )}
        </div>
        <Avatar
          onClick={() => profileImageInputRef.current?.click()}
          className="size-24 ring-4 ring-background -translate-y-1/2 mx-3"
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
      <Input
        placeholder="@Tag"
        onChange={(e) =>
          setNewUserData((prev) => ({ ...prev!, tag: e.target.value }))
        }
        value={newUserData.tag}
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
        <DialogClose ref={closeModalRef}>Cancel</DialogClose>
        <Button
          onClick={() => updateUser()}
          disabled={isUpdating || disableUpdateButton}
        >
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
