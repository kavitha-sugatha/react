import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'host',
      exposes: {
        './Header': './src/Header.tsx',
        './emailValidator': './src/email_validator.tsx',
        './utils': './src/utils.tsx'
      },
      remotes: {
        remote1: "remote1@http://localhost:3001/mf-manifest.json",
      },
      // shared: ['react', 'react-dom'],
      shared: {
        react: { eager: true, singleton: true, requiredVersion: false },
        "react-dom": { eager: true, singleton: true, requiredVersion: false },
      },
    }),
  ],
  server: {
    port: 3000,
  },
});