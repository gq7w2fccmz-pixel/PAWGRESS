import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  name: string;
  avatarImg: string;      // coach image path
  memberSince: string;    // ISO date
  unit: "kg" | "lbs";
  distUnit: "km" | "mi";
  language: "de" | "en";
}

interface ProfileStore {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const DEFAULT: UserProfile = {
  name: "Champion",
  avatarImg: "/images/coach_lilly.webp",
  memberSince: new Date().toISOString().split("T")[0],
  unit: "kg",
  distUnit: "km",
  language: "de",
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: DEFAULT,
      updateProfile: (updates) =>
        set(s => ({ profile: { ...s.profile, ...updates } })),
    }),
    { name: "pawgress-profile" }
  )
);
