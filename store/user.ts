import { create } from "zustand";
import { User as UserType } from "@prisma/client";
import UserClientService from "@/db/services/client/user.service";
import tryCatch from "@/utils/tryCatch";
import { redirect } from "next/navigation";

type UserStore = {
  user: UserType | null;
  error: string;
  loading: boolean;
  setUser: (user: UserType | null) => void;
  fetchUser: () => Promise<void>;
  validateOrRedirect: () => void;
};

const useUserStore = create<UserStore>()((set, get) => ({
  user: null,
  error: "",
  loading: true,
  setUser: (user) => set({ user }),
  validateOrRedirect: () => {
    if (get().user) return;
    redirect("/login");
  },
  async fetchUser() {
    const { data: user, error } = await tryCatch(UserClientService.getMe());
    if (error) return set({ error: error.message, loading: false, user: null });
    set({ user: user?.id ? user : null, loading: false });
  },
}));

export default useUserStore;
