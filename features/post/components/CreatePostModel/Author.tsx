import useUserStore from "@/store/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";

export default function Author() {
  const user = useUserStore((state) => state.user!);
  return (
    <div>
      <Avatar>
        <AvatarImage src={user.image_url!} />
        <AvatarFallback>
          {formatUserNameForImage(user.user_name)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
