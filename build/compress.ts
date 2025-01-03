import type { Plugin } from "vite";
import { isArray } from "@pureadmin/utils";
import compressPlugin from "vite-plugin-compression";
import archiver from "archiver";
import fs from "fs";
import path from "path";

async function zipDist(): Promise<void> {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", {
      zlib: { level: 9 }
    });
    const output = fs.createWriteStream(path.join(process.cwd(), "dist.zip"));

    output.on("close", () => {
      resolve();
    });

    archive.on("error", err => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory("dist/", false);
    archive.finalize();
  });
}

export const configCompressPlugin = (
  compress: ViteCompression
): Plugin | Plugin[] => {
  if (compress === "none") return null;

  const gz = {
    ext: ".gz",
    threshold: 0,
    filter: () => true,
    deleteOriginFile: false
  };
  const br = {
    ext: ".br",
    algorithm: "brotliCompress",
    threshold: 0,
    filter: () => true,
    deleteOriginFile: false
  };

  const codeList = [
    { k: "gzip", v: gz },
    { k: "brotli", v: br },
    { k: "both", v: [gz, br] }
  ];

  const plugins: Plugin[] = [];

  codeList.forEach(item => {
    if (compress.includes(item.k)) {
      if (compress.includes("clear")) {
        if (isArray(item.v)) {
          item.v.forEach(vItem => {
            plugins.push(
              compressPlugin(Object.assign(vItem, { deleteOriginFile: true }))
            );
          });
        } else {
          plugins.push(
            compressPlugin(Object.assign(item.v, { deleteOriginFile: true }))
          );
        }
      } else {
        if (isArray(item.v)) {
          item.v.forEach(vItem => {
            plugins.push(compressPlugin(vItem));
          });
        } else {
          plugins.push(compressPlugin(item.v));
        }
      }
    }
  });

  // 添加 zip 插件
  if (compress.includes("zip")) {
    plugins.push({
      name: "vite-plugin-zip-dist",
      closeBundle: async () => {
        try {
          await zipDist();
        } catch (error) {
          console.error("Failed to zip dist directory:", error);
        }
      }
    });
  }

  return plugins;
};
