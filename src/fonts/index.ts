import localFont from "next/font/local";

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

// Condensed Variante
export const akzidenzCondensed = localFont({
  src: [
    {
      path: "./AkzidenzGroteskBQ-LigCnd.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-LigCndIt.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-Cnd.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-CndIt.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-MdCnd.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-MdCndIt.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-BdCnd.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-BdCndIt.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-XBdCnd.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-XBdCndIt.ttf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-akzidenz-condensed",
  display: "swap",
});

// Condensed Alt Variante
export const akzidenzCondensedAlt = localFont({
  src: [
    {
      path: "./AkzidenzGroteskBQ-BdCndAlt.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-MdCndAlt.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-MdCndItAlt.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-XBdCndAlt.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-XBdCndItAlt.ttf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-akzidenz-condensed-alt",
  display: "swap",
});

// Extended Variante
export const akzidenzExtended = localFont({
  src: [
    {
      path: "./AkzidenzGroteskBQ-Ext.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-ExtIt.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-MedExt.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-MedExtIt.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-BoldExt.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-BoldExtIt.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./AkzidenzGroteskBQ-LigExt.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-LigExtIt.ttf",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-akzidenz-extended",
  display: "swap",
});

// Light Sondervarianten (OsF = Old Style Figures, SC = Small Caps)
export const akzidenzLight = localFont({
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
      path: "./AkzidenzGroteskBQ-LightOsF.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-LightSC.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./AkzidenzGroteskBQ-LigItOsF.ttf",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-akzidenz-light",
  display: "swap",
});

// XBold Alt Variante
export const akzidenzXBoldAlt = localFont({
  src: [
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
      path: "./AkzidenzGroteskBQ-XBoldAlt.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-akzidenz-xbold-alt",
  display: "swap",
});

// Tailwind 4 CSS Variable Namen für deine theme config
export const fontVariables = {
  akzidenz: "--font-akzidenz",
  akzidenzCondensed: "--font-akzidenz-condensed",
  akzidenzCondensedAlt: "--font-akzidenz-condensed-alt",
  akzidenzExtended: "--font-akzidenz-extended",
  akzidenzLight: "--font-akzidenz-light",
  akzidenzXBoldAlt: "--font-akzidenz-xbold-alt",
};
