import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserStore from "@/store/user";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";

export default function Author() {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  return (
    <div>
      <Avatar>
        <AvatarImage src={user.image_url || undefined} />
        <AvatarFallback>
          {formatUserNameForImage(user.user_name)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
