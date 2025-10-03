import { build } from "velite";
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // Export a fully static site for GitHub Pages
  output: "export",

  // GH Pages has no Next image optimizer
  images: { unoptimized: true },

  // Avoid 404 on static hosting for route folders
  trailingSlash: true,

  // Serve under subpath when in production (GH Pages)
  basePath: isProd ? "/test-blog" : undefined,
  assetPrefix: isProd ? "/test-blog/" : undefined,

  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

class VeliteWebpackPlugin {
  static started = false;
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      await build({ watch: dev, clean: !dev });
    });
  }
}

export default nextConfig;
