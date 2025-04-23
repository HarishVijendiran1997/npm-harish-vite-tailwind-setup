#!/usr/bin/env node

const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

const run = async () => {
  const projectPath = process.cwd();

  // ✅ Check if we're inside a valid Vite project
  if (!fs.existsSync(path.join(projectPath, 'vite.config.js'))) {
    console.error('❌ Not a Vite project. Run this inside your Vite + React app folder.');
    process.exit(1);
  }

  // Step 1: Install Tailwind CSS + plugin
  console.log('📦 Installing Tailwind CSS and @tailwindcss/vite...');
  await execa('npm', ['install', 'tailwindcss', '@tailwindcss/vite', '-D']);

  // Step 2: Overwrite vite.config.js
  console.log('⚙️ Updating vite.config.js...');
  const viteConfigPath = path.join(projectPath, 'vite.config.js');
  const viteConfigContent = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
  `.trim();

  await fs.writeFile(viteConfigPath, viteConfigContent);

  // Step 3: Overwrite src/index.css
  console.log('🎨 Configuring Tailwind in index.css...');
  const indexCssPath = path.join(projectPath, 'src', 'index.css');
  await fs.writeFile(indexCssPath, '@import "tailwindcss";\n');

  // Step 4: Clean up App.css and update App.jsx
  console.log('🧹 Cleaning up App.jsx...');
  const appCssPath = path.join(projectPath, 'src', 'App.css');
  const appJsxPath = path.join(projectPath, 'src', 'App.jsx');

  if (fs.existsSync(appCssPath)) {
    await fs.remove(appCssPath);
  }

  const newAppJsxContent = `
import React from "react";
 
function App() {
  return (
    <div className="h-screen flex justify-center items-center bg-neutral-800 text-white">
      <h1 className="text-4xl font-bold">
        Happy coding with <span className="text-5xl" style={{ color: '#4DC0B5' }}>Tailwind 4</span>
      </h1>
    </div>
  );
}

export default App;
  `.trim();

  await fs.writeFile(appJsxPath, newAppJsxContent);

  console.log('\n✅ All done! Tailwind 4 is ready in your Vite + React project 🎉');
  console.log('👉 Run your project with:');
  console.log('\n   npm run dev\n');
};

run();
