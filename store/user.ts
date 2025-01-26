import { create } from "zustand";
import ky from "ky";
import { User as UserType } from "@prisma/client";

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
  loading: false,
  setUser: (user) => set({ user }),
  async fetchUser() {
    const data = await ky.get<UserType | null>("http://localhost:3000/api/me", {
      credentials: "include",
      throwHttpErrors: false,
    });
    if (data.status !== 200) {
      set({ user: null, error: "You Must Be Authenticated" });
    }
    const user = await data.json();
    set({ user: user });
  },
}));

export default useUserStore;
