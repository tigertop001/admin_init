import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { type UserConfigExport, type ConfigEnv, loadEnv } from "vite";
import {
  root,
  alias,
  wrapperEnv,
  pathResolve,
  __APP_INFO__
} from "./build/utils";

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const env = loadEnv(mode, "envs");
  console.log("Build Mode:", mode);
  console.log("Environment Variables:", {
    VITE_ROUTER_HISTORY: env.VITE_ROUTER_HISTORY,
    VITE_PUBLIC_PATH: env.VITE_PUBLIC_PATH
  });

  const {
    VITE_ROUTER_HISTORY,
    VITE_PUBLIC_PATH,
    VITE_PORT,
    VITE_CDN,
    VITE_COMPRESSION
  } = wrapperEnv(env);

  // 确保这些值存在
  if (!VITE_ROUTER_HISTORY) {
    console.warn(
      "VITE_ROUTER_HISTORY not found in env, using default hash mode"
    );
  }
  if (!VITE_PUBLIC_PATH) {
    console.warn("VITE_PUBLIC_PATH not found in env, using default root path");
  }
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    envDir: "envs",
    server: {
      port: VITE_PORT,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: path => path
        },
        "/mock": {
          target: "http://0.0.0.0:7300",
          changeOrigin: true,
          rewrite: path => path
        }
      }
    },
    preview: {
      port: VITE_PORT,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: path => path
        },
        "/mock": {
          target: "http://0.0.0.0:7300",
          changeOrigin: true,
          rewrite: path => path
        }
      }
    },
    plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION),
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      target: "es2015",
      sourcemap: true, // 开启 sourcemap 以便调试
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("./index.html", import.meta.url)
        },
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
