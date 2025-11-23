import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const phasermsg = () => {
    return {
        name: 'phasermsg',
        buildStart() {
            process.stdout.write(`Building for production...\n`);
        },
        buildEnd() {
            process.stdout.write(` Build done \n`);
        }
    }
}

export default defineConfig({
    base: './',
    plugins: [
        react(),
        phasermsg()
    ],
    logLevel: 'warning',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, '../index.html'),
                validate: resolve(__dirname, '../static/validate.html'),
                // questionnaire: resolve(__dirname, '../static/questionnaire.html'),
                admin: resolve(__dirname, '../static/admin.html'),
                adminLogin: resolve(__dirname, '../static/adminLogin.html')
            },
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2
            },
            mangle: true,
            format: {
                comments: false
            }
        }
    }
});
