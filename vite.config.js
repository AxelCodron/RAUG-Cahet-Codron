import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    clearScreen: false,
    base: './',
    
    build: {
        sourcemap: true,
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'esbuild',
        // Increase the warning limit since Three.js is naturally large
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // Improved chunk splitting strategy
                manualChunks: (id) => {
                    if (id.includes('node_modules/three/')) {
                        if (id.includes('examples/jsm/')) {
                            return 'three.examples';
                        }
                        return 'three.core';
                    }
                    if (id.includes('node_modules/')) {
                        return 'vendor';
                    }
                },
                // Organized output structure
                chunkFileNames: (chunkInfo) => {
                    const prefix = chunkInfo.name.includes('three') ? 'three/' : 'js/';
                    return `assets/${prefix}[name]-[hash].js`;
                },
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const extType = assetInfo.name.split('.').at(1);
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        return 'assets/images/[name]-[hash][extname]';
                    }
                    if (/wasm/i.test(extType)) {
                        return 'assets/wasm/[name]-[hash][extname]';
                    }
                    return 'assets/[ext]/[name]-[hash][extname]';
                }
            }
        },
        target: 'esnext',
        // Additional esbuild optimization options
        esbuild: {
            legalComments: 'none',
            treeShaking: true,
        }
    },

    server: {
        open: true,
        host: true,
        port: 3000,
        cors: true,
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp'
        }
    },

    optimizeDeps: {
        include: ['three'],
        exclude: ['vite-plugin-glsl']
    },

    plugins: [
        viteStaticCopy({
            targets: [
                { src: 'node_modules/three/examples/jsm/libs/ammo.wasm.js', dest: 'jsm/libs/' },
                { src: 'node_modules/three/examples/jsm/libs/ammo.wasm.wasm', dest: 'jsm/libs/' },
                { src: 'node_modules/three/examples/jsm/libs/draco/gltf/draco_decoder.js', dest: 'jsm/libs/draco/gltf' },
                { src: 'node_modules/three/examples/jsm/libs/draco/gltf/draco_decoder.wasm', dest: 'jsm/libs/draco/gltf/' },
                { src: 'node_modules/three/examples/jsm/libs/draco/gltf/draco_encoder.js', dest: 'jsm/libs/draco/gltf/' },
                { src: 'node_modules/three/examples/jsm/libs/draco/gltf/draco_wasm_wrapper.js', dest: 'jsm/libs/draco/gltf/' }
            ],
            hook: 'buildEnd'
        }),
        glsl({
            include: [
                '**/*.glsl',
                '**/*.vert',
                '**/*.frag'
            ],
            exclude: 'node_modules/**',
            warnDuplicatedImports: true,
            defaultExtension: 'glsl',
            compress: false,
            watch: true
        })
    ],

    define: {
        'process.env': {}
    },

    resolve: {
        alias: {
            '@': '/src',
            'three-examples': 'three/examples/jsm'
        }
    }
})