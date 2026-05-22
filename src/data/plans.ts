import type { Plan, Coach, LockedCoach } from "../types";
import { colors } from "../styles/tokens";

export const PLANS: Plan[] = [
  { name: "FOUNDATION PATH",  desc: "Der perfekte Einstieg für einen starken Körper.",    days: 4, level: "Fortgeschritten", icon: "🏋️", color: colors.red,    tag: true },
  { name: "IRON PROGRESSION", desc: "Maximale Kraftentwicklung durch Grundübungen.",       days: 4, level: "Fortgeschritten", icon: "💪", color: colors.blue },
  { name: "ATHLETIC CUT",     desc: "Fett verlieren, Muskeln erhalten.",                   days: 5, level: "Fortgeschritten", icon: "🏃", color: colors.green },
  { name: "STRONG START",     desc: "Solider Start mit den wichtigsten Grundlagen.",        days: 3, level: "Anfänger",        icon: "🛡️", color: colors.orange },
  { name: "PEAK PERFORMANCE", desc: "Maximale Power und athletische Leistung.",            days: 5, level: "Fortgeschritten", icon: "🚀", color: colors.orange },
  { name: "ENDURANCE FLOW",   desc: "Verbessere Ausdauer und Fitness.",                    days: 3, level: "Alle Level",      icon: "❤️", color: colors.cyan },
];

export const PLAN_FILTERS = ["EMPFOHLEN", "MUSKELAUFBAU", "KRAFT", "FETTVERLUST", "LEISTUNG", "ANFÄNGER"] as const;

export const ACTIVE_COACHES: Coach[] = [
  {
    name: "Bertl",
    title: "COACH",
    desc: "Ausgewogen, nachhaltig und auf langfristigen Fortschritt ausgelegt.",
    focus: "Allround",
    color: colors.orange,
    emoji: "🐩",
    heroImage: "/images/coach_bertl.webp",
    focusIcon: "🐾",
  },
  {
    name: "Lilly",
    title: "COACH",
    desc: "Motivierend, energiegeladen und immer an deiner Seite. Lilly bringt Spaß ins Training.",
    focus: "Motivation",
    color: "#ec4899",
    emoji: "🐭",
    heroImage: "/images/coach_lilly.webp",
    focusIcon: "⚡",
  },
];

export const LOCKED_COACHES: LockedCoach[] = [
  { name: "Pam",   title: "COACH",                    req: "1 Workout",   sub: "abschließen",                    p: 0, max: 1,  color: "#db6e8f",     emoji: "🐻", heroImage: "/images/coach_pam.webp" },
  { name: "Bärli", title: "COACH",                    req: "2 Tage Streak", sub: "2 Tage hintereinander trainieren", p: 0, max: 2, color: "#9333ea",    emoji: "🐻", heroImage: "/images/coach_baerli.webp" },
  { name: "Ben",   title: "COACH",                    req: "1× Kraft + 1× Cardio + 1× Stretch", sub: "je eine Übung aus allen drei Bereichen", p: 0, max: 3,  color: "#84cc16",     emoji: "🦙", heroImage: "/images/coach_ben.webp" },
  { name: "Otto",  title: "COACH",                    req: "20 Workouts", sub: "insgesamt abschließen",           p: 0, max: 20, color: "#6b7c3a",     emoji: "🦦", heroImage: "/images/coach_otto.webp" },
  { name: "Trude", title: "COACH",                    req: "10 Workouts", sub: "mit Kraftübungen abschließen",    p: 0, max: 10, color: "#a855f7",     emoji: "🐱", heroImage: "/images/coach_trude.webp" },
  { name: "Fredl", title: "COACH",                    req: "10 Workouts", sub: "mit Cardioübungen abschließen",   p: 0, max: 10, color: "#84cc16",     emoji: "🦊", heroImage: "/images/coach_fredl.webp" },
  { name: "Leya",  title: "LEHRMEISTERIN CARDIO",     req: "50 Workouts", sub: "mit Cardioübungen abschließen",   p: 0, max: 50, color: "#a855f7",     emoji: "🐆", heroImage: "/images/coach_leya.webp" },
  { name: "Tim",   title: "LEHRMEISTER IM ARMTRAINING", req: "50 Workouts", sub: "mit Armübungen abschließen",   p: 0, max: 50, color: colors.orange, emoji: "🐯", heroImage: "/images/coach_tim.webp" },
  { name: "Leon",  title: "LEHRMEISTER CORE",         req: "50 Workouts", sub: "mit Coreübungen abschließen",    p: 0, max: 50, color: colors.yellow, emoji: "🦁", heroImage: "/images/coach_leon.webp" },
  { name: "Rocko", title: "LEHRMEISTER BRUST",        req: "50 Workouts", sub: "mit Brustübungen abschließen",   p: 0, max: 50, color: colors.yellow, emoji: "🦍", heroImage: "/images/coach_rocko.webp" },
  { name: "Toro",  title: "LEHRMEISTER DES RÜCKENS",  req: "50 Workouts", sub: "mit Rückenübungen abschließen",  p: 0, max: 50, color: colors.red,    emoji: "🐂", heroImage: "/images/coach_toro.webp" },
  { name: "Olli",  title: "LEHRMEISTER BEINE",        req: "50 Workouts", sub: "mit Beinübungen abschließen",    p: 0, max: 50, color: "#84cc16",     emoji: "🐘", heroImage: "/images/coach_olli.webp" },
  { name: "Rhino", title: "LEHRMEISTER SCHULTERN",    req: "50 Workouts", sub: "mit Schulterübungen abschließen", p: 0, max: 50, color: colors.blue,   emoji: "🦏", heroImage: "/images/coach_rhino.webp" },
  { name: "Willi", title: "COACH",                    req: "4× Gewichtssteigerung", sub: "beim Bankdrücken (KH oder LH)",   p: 0, max: 4,  color: "#b45309",     emoji: "🦝", heroImage: "/images/coach_willi.webp" },
  { name: "Mia",   title: "COACH",                    req: "10 Workouts", sub: "mit Stretchübungen abschließen",  p: 0, max: 10, color: "#c084fc",     emoji: "🦊", heroImage: "/images/coach_mia.webp" },
  { name: "Wolfi", title: "COACH",                    req: "40 Workouts", sub: "insgesamt abschließen",           p: 0, max: 40, color: "#7c3aed",     emoji: "🐺", heroImage: "/images/coach_wolfi.webp" },
  { name: "Sen",   title: "LEHRMEISTER STRETCH",      req: "50 Workouts", sub: "mit Stretchübungen abschließen", p: 0, max: 50, color: colors.cyan,   emoji: "🦢", heroImage: "/images/coach_sen.webp" },
];
