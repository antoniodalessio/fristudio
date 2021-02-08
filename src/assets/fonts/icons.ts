export type IconsId =
  | "ancora_intera"
  | "behance"
  | "chiudi"
  | "favicon"
  | "hamburger"
  | "instagram"
  | "logo"
  | "rosa";

export type IconsKey =
  | "AncoraIntera"
  | "Behance"
  | "Chiudi"
  | "Favicon"
  | "Hamburger"
  | "Instagram"
  | "Logo"
  | "Rosa";

export enum Icons {
  AncoraIntera = "ancora_intera",
  Behance = "behance",
  Chiudi = "chiudi",
  Favicon = "favicon",
  Hamburger = "hamburger",
  Instagram = "instagram",
  Logo = "logo",
  Rosa = "rosa",
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.AncoraIntera]: "61697",
  [Icons.Behance]: "61698",
  [Icons.Chiudi]: "61699",
  [Icons.Favicon]: "61700",
  [Icons.Hamburger]: "61701",
  [Icons.Instagram]: "61702",
  [Icons.Logo]: "61703",
  [Icons.Rosa]: "61704",
};
