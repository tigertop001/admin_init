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
    // jsx、tsx语法支持
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
    // 按下Command(⌘)+Shift(⇧)，然后点击页面元素会自动打开本地IDE并跳转到对应的代码位置
    Inspector(),
    viteBuildInfo(),
    /**
     * 开发环境下移除非必要的vue-router动态路由警告No match found for location with path
     * 非必要具体看 https://github.com/vuejs/router/issues/521 和 https://github.com/vuejs/router/issues/359
     * vite-plugin-router-warn只在开发环境下启用，只处理vue-router文件并且只在服务启动或重启时运行一次，性能消耗可忽略不计
     */
    removeNoMatch(),
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        extract: true
      }
    }),
    // svg组件化支持
    svgLoader(),
    VITE_CDN ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
    UnoCSS(),
    // 线上环境删除console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    // 打包分析
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : (null as any),
    {
      name: "clear-vite-cache",
      apply: "serve", // 只在开发环境下启用
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
