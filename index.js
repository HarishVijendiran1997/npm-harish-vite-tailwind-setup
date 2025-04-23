#!/usr/bin/env node

const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

const run = async () => {
  const projectPath = process.cwd();

  if (!fs.existsSync(path.join(projectPath, 'vite.config.js'))) {
    console.error('❌ Not a Vite project. Run this inside your Vite + React app folder.');
    process.exit(1);
  }

  // Step 1: Install Tailwind + Vite plugin
  console.log('Installing Tailwind CSS and Vite plugin...');
  await execa('npm', ['install', 'tailwindcss', '@tailwindcss/vite', '-D']);

  // Step 2: Modify vite.config.js
  console.log('Updating vite.config.js...');
  const viteConfig = path.join(projectPath, 'vite.config.js');
  let viteConfigContent = await fs.readFile(viteConfig, 'utf-8');
  viteConfigContent = viteConfigContent.replace(
    'plugins: [react()]',
    'plugins: [react(), require("@tailwindcss/vite")]'
  );
  await fs.writeFile(viteConfig, viteConfigContent);

  // Step 3: Clean src/index.css
  console.log('Cleaning up src/index.css...');
  const indexCss = path.join(projectPath, 'src', 'index.css');
  await fs.writeFile(indexCss, '@import "tailwindcss";\n');

  // Step 4: Delete App.css and modify App.jsx
  console.log('Cleaning up App.jsx...');
  const appCss = path.join(projectPath, 'src', 'App.css');
  const appJsx = path.join(projectPath, 'src', 'App.jsx');

  if (fs.existsSync(appCss)) {
    await fs.remove(appCss);
  }

  let appJsxContent = await fs.readFile(appJsx, 'utf-8');
  appJsxContent = appJsxContent.replace(/import\s+['"]\.\/App\.css['"];\s*/g, '');

  appJsxContent = `
function App() {
  return (
    <div className="h-screen flex justify-center items- bg-neutral-800 text-white">
      <h1 className="text-4xl font-bold">Happy coding with <span className="text-5xl color-[#4DC0B5]">Tailwind 4</span></h1>
    </div>
  );
}

export default App;
  `;

  await fs.writeFile(appJsx, appJsxContent.trim());

  console.log('🎉 Setup complete! You can now run your Vite project.');
};

run();
