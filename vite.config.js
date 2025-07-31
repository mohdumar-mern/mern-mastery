import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    // Base path for deployment (e.g., GitHub Pages or subfolder)
    base: env.VITE_BASE_URL || '/',
    plugins: [
      react(),
      tailwindcss(), // Ensure tailwind.config.js exists in root
    ],
    // resolve: {
    //   alias: {
    //     '@': path.resolve(__dirname, './src'), // Alias for cleaner imports
    //   },
    // },
    build: {
      // Optimize build for production
      target: 'esnext', // Use modern JavaScript
      minify: 'esbuild', // Faster minification
      chunkSizeWarningLimit: 1000, // Warn if chunks exceed 1MB
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'; // Separate vendor chunks
            }
          },
        },
      },
      sourcemap: isProduction ? false : 'inline', // Disable in production for security
    },
    // server: {
    //   // Development server settings
    //   host: '0.0.0.0', // Allow external access
    //   port: 3000,
    //   open: true,
    //   hmr: {
    //     overlay: true, // Enable HMR overlay
    //   },
    // },
    optimizeDeps: {
      // Pre-bundle dependencies
      include: ['react', 'react-dom', 'react-router-dom', 'react-toastify', 'hls.js'],
    },
  
    envPrefix: 'VITE_', // Prefix for environment variables
   
  };
});