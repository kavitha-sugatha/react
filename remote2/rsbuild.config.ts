import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "remote2",
      exposes: {
        './App': './src/App.tsx',
      },
      remotes: {
        host: "host@http://localhost:3000/mf-manifest.json",
      },
      shared: {
        react: { eager: true, singleton: true, requiredVersion: false },
        "react-dom": { eager: true, singleton: true, requiredVersion: false },
      },
    }),
  ],
  server: {
    port: 3002,
  },
});