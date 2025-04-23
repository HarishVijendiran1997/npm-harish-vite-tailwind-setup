#!/usr/bin/env node

const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

const run = async () => {
  const projectName = process.argv[2] || 'vite-react-app';
  const projectPath = path.join(process.cwd(), projectName);
  process.chdir(projectPath);

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

  // Remove App.css if exists
  if (fs.existsSync(appCss)) {
    await fs.remove(appCss);
  }

  // Remove import of App.css in App.jsx
  let appJsxContent = await fs.readFile(appJsx, 'utf-8');
  appJsxContent = appJsxContent.replace('import \'./App.css\';', '');

  // Replace the content of App.jsx with simple "Happy coding"
  appJsxContent = `
function App() {
  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-4xl font-bold">Happy coding</h1>
    </div>
  );
}

export default App;
  `;

  await fs.writeFile(appJsx, appJsxContent);

  console.log('🎉 Setup complete! You can now run your Vite project.');
};

run();
