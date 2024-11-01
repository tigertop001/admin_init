import presetUno from "@unocss/preset-uno";
import { defineConfig } from "unocss";

export default defineConfig({
  rules: [
    [
      "flex-c",
      { display: "flex", "justify-content": "center", "align-items": "center" }
    ]
  ],
  presets: [presetUno()]
});
