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
import Image from "next/image";
import UserClientService from "@/db/services/client/user.service";
import type { UserUpdateData } from "@/db/services/validators/user.validator";
import sendToastEvent from "@/utils/sendToastEvent";
import { Uploader } from "@vertex/uploader";

const useUserUpdate = (userId: string) => {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationKey: ["me"],
    mutationFn: (data: UserUpdateData) => UserClientService.updateUser(data),
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

// FIX: this code looks like a mess
export default function EditProfileModal() {
  const userData = useUserStore((state) => state.user);
  const [newUserData, setNewUserData] = useState<UserUpdateData>({});
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const bannerImageInputRef = useRef<HTMLInputElement>(null);
  const closeModalRef = useRef<HTMLButtonElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const imageId = useRef("");
  const bannerId = useRef("");
  const uploader = useRef(new Uploader());
  const [isUploading, setIsUploading] = useState(false);
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
    if (!e.target.files) return;
    const clientBanner = await uploader.current.uploadToClient(
      e.target.files[0],
    );
    bannerId.current = clientBanner?.id || "";
    setNewUserData((prev) => ({ ...prev!, banner_url: clientBanner?.name }));
  };

  const uploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const clientImage = await uploader.current.uploadToClient(
      e.target.files[0],
    );
    imageId.current = clientImage?.id || "";
    setNewUserData((prev) => ({ ...prev!, image_url: clientImage?.name }));
  };

  const { updateUser, isUpdating } = useUserUpdate(userData!.id);

  const handleUpdateUser = async () => {
    setIsUploading(true);
    const imageUrl = await uploader.current.sendOne(imageId.current, {
      onError(e) {
        sendToastEvent({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
      },
    });

    const bannerUrl = await uploader.current.sendOne(bannerId.current, {
      onError(e) {
        sendToastEvent({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
      },
    });

    const data = {
      user_name: newUserData?.user_name,
      bio: newUserData?.bio,
      image_url: imageUrl?.data.url,
      banner_url: bannerUrl?.data.url,
      tag: newUserData?.tag,
    };

    await updateUser(data);
    setIsUploading(false);
  };

  useEffect(() => {
    document.addEventListener("close-edit-modal", () => {
      closeModalRef.current?.click();
    });

    document.addEventListener("keypress", (e) => {
      if (
        e.key === "Enter" &&
        modelRef.current?.contains(document.activeElement)
      ) {
        handleUpdateUser();
      }
    });

    return () => {
      document.removeEventListener("close-edit-modal", () => {
        closeModalRef.current?.click();
      });
      document.removeEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          handleUpdateUser();
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
          setNewUserData((prev) => ({
            ...prev!,
            tag: e.target.value.replace(/@/g, ""),
          }))
        }
        value={`${newUserData.tag}`}
      />
      <div className="relative">
        <Textarea
          placeholder="Bio"
          rows={4}
          onChange={(e) =>
            setNewUserData((prev) => ({ ...prev!, bio: e.target.value }))
          }
          value={newUserData?.bio || ""}
        />
        <span
          className={`absolute right-2 bottom-2 text-xs text-muted-foreground ${(newUserData?.bio?.length || 0) > 1000 ? "text-red-500" : ""}`}
        >
          {newUserData?.bio?.length || 0}/1000
        </span>
      </div>
      <DialogFooter className="flex gap-4">
        <DialogClose ref={closeModalRef}>Cancel</DialogClose>
        <Button
          onClick={() => handleUpdateUser()}
          disabled={isUpdating || disableUpdateButton || isUploading}
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
