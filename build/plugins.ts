import { cdn } from "./cdn";
import vue from "@vitejs/plugin-vue";
import { pathResolve } from "./utils";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import type { PluginOption } from "vite";
import checker from "vite-plugin-checker";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Inspector from "vite-plugin-vue-inspector";
import { configCompressPlugin } from "./compress";
import removeNoMatch from "vite-plugin-router-warn";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import { themePreprocessorPlugin } from "@pureadmin/theme";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { genScssMultipleScopeVars } from "../src/layout/theme";
import UnoCSS from "unocss/vite";
import fs from "fs";
import path from "path";
export function getPluginsList(
  VITE_CDN: boolean,
  VITE_COMPRESSION: ViteCompression
): PluginOption[] {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    vueJsx(),
    VueI18nPlugin({
      jitCompilation: false,
      include: [pathResolve("../locales/**")]
    }),
    checker({
      typescript: true,
      vueTsc: true,
      eslint: {
        lintCommand: `eslint ${pathResolve("../{src,build}/**/*.{vue,js,ts,tsx}")}`,
        useFlatConfig: true
      },
      terminal: false,
      enableBuild: false
    }),
    Inspector(),
    viteBuildInfo(),
    removeNoMatch(),
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        extract: true
      }
    }),
    svgLoader(),
    VITE_CDN ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
    UnoCSS(),
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : (null as any),
    {
      name: "clear-vite-cache",
      apply: "serve",
      configureServer(server) {
        server.httpServer.on("close", () => {
          const viteCacheDir = path.resolve(__dirname, "node_modules/.vite");

          if (fs.existsSync(viteCacheDir)) {
            fs.rmSync(viteCacheDir, { recursive: true, force: true });
            console.log("Vite 缓存已清理");
          } else {
            console.log("Vite 缓存目录不存在");
          }
        });
      }
    }
  ];
}
