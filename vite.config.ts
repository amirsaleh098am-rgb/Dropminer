import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const asyncInitPlugins = async () => {
  const isDev = process.env.NODE_ENV !== 'production';
  const plugins = [];

  plugins.push(vue());

  if (isDev) {
    const { createHtmlPlugin } = await import('vite-plugin-html');
    plugins.push(createHtmlPlugin());
  }

  return plugins;
};

export default defineConfig(async () => {
  const plugins = await asyncInitPlugins();
  return { plugins };
});