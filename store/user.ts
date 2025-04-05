import { create } from "zustand";
import { User as UserType } from "@prisma/client";
import UserClientService from "@/db/services/client/user.service";
import tryCatch from "@/utils/tryCatch";

type UserStore = {
  user: UserType | null;
  error: string;
  loading: boolean;
  setUser: (user: UserType | null) => void;
  fetchUser: () => Promise<void>;
};

const useUserStore = create<UserStore>()((set) => ({
  user: null,
  error: "",
  loading: true,
  setUser: (user) => set({ user }),
  async fetchUser() {
    const { data: user, error } = await tryCatch(UserClientService.getMe());
    if (error) return set({ error: error.message, loading: false, user: null });
    set({ user: user || null, loading: false });
  },
}));

export default useUserStore;
