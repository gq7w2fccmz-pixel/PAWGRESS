import type { GymArea, AreaName } from "../types";
import { images } from "../assets/images";
import { colors } from "../styles/tokens";

export const GYM_AREAS: GymArea[] = [
  { name: "BRUST",     color: colors.red,    img: images.gym.brust },
  { name: "RÜCKEN",    color: colors.blue,   img: images.gym.ruecken },
  { name: "BEINE",     color: colors.green,  img: images.gym.beine },
  { name: "SCHULTERN", color: colors.yellow, img: images.gym.schultern },
  { name: "ARME",      color: colors.orange, img: images.gym.arme },
  { name: "CORE",      color: colors.purple, img: images.gym.core },
  { name: "CARDIO",    color: colors.cyan,   img: images.gym.cardio },
  { name: "STRETCH",   color: "#d97706",     img: images.gym.stretch },
];

export const AREA_HERO: Record<AreaName, string> = {
  BRUST:     images.heroes.BRUST,
  RÜCKEN:    images.heroes.RÜCKEN,
  BEINE:     images.heroes.BEINE,
  SCHULTERN: images.heroes.SCHULTERN,
  ARME:      images.heroes.ARME,
  CORE:      images.heroes.CORE,
  CARDIO:    images.heroes.CARDIO,
  STRETCH:   images.heroes.STRETCH,
};

export const AREA_COLOR: Record<AreaName, string> = {
  BRUST:     colors.red,
  RÜCKEN:    colors.blue,
  BEINE:     colors.green,
  SCHULTERN: colors.yellow,
  ARME:      colors.orange,
  CORE:      colors.purple,
  CARDIO:    colors.cyan,
  STRETCH:   "#d97706",
};
