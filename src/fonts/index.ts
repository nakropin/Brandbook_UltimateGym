import localFont from "next/font/local";

export const jersey = localFont({
  src: "./Jersey M54.ttf",
  variable: "--font-jersey",
  display: "swap",
});

// Normale Breite (Standard)
export const akzidenz = localFont({
  src: [
    {
      path: "./AkzidenzGroteskBQ-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-LightIt.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-Reg.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-MedItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-XBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-XBoldIt.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-Super.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-SuperItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-akzidenz",
  display: "swap",
});

// Optional: Condensed als separate Font-Familie
export const akzidenzCondensed = localFont({
  src: [
    {
      path: "./AkzidenzGroteskBQ-LigCnd.ttf",
      weight: "300",
    },
    {
      path: "./AkzidenzGroteskBQ-Cnd.ttf",
      weight: "400",
    },
    {
      path: "./AkzidenzGroteskBQ-MdCnd.ttf",
      weight: "500",
    },
    {
      path: "./AkzidenzGroteskBQ-BdCnd.ttf",
      weight: "700",
    },
  ],
  variable: "--font-akzidenz-condensed",
  display: "swap",
});
