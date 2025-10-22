import { ColorTileProps } from "@/types/types";

export default function ColorTile({ name, hexcolor }: ColorTileProps) {
  const colorWithoutHash = hexcolor.slice(1);
  const copyToClipboard = async () => {
    try {
      // Überprüfe ob Clipboard API verfügbar ist (HTTPS oder localhost)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(colorWithoutHash);
      } else {
        // Fallback für unsichere Kontexte
        const textarea = document.createElement("textarea");
        textarea.value = colorWithoutHash;

        // Textarea unsichtbar außerhalb des Viewports platzieren
        textarea.style.position = "absolute";
        textarea.style.left = "-999999px";

        document.body.prepend(textarea);
        textarea.select();

        try {
          document.execCommand("copy");
        } finally {
          textarea.remove();
        }
      }

      // Optional: Feedback für erfolgreiche Kopie
      console.log(`${hexcolor} erfolgreich kopiert!`);
    } catch (error) {
      console.error("Fehler beim Kopieren:", error);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`w-full aspect-square text-center flex justify-center items-center p-4 ${
        name === "white" ? "border-2 border-black text-black" : "text-white"
      }`}
      style={{ backgroundColor: hexcolor }}
      aria-label={`${name} Farbe kopieren`}
    >
      {name.replace("_", " ").toUpperCase()}
      <br />
      {hexcolor.toUpperCase()}
    </button>
  );
}
