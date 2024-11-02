import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    clearScreen: false,
    base: '/RAUG-Cahet-Codron/',
    
    build: {
        sourcemap: true,
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ['three']
                },
                // Ensure proper paths for imports
                paths: {
                    'three': './assets/js/three.module.js',
                },
                // Format modules as ES
                format: 'es'
            }
        }
    },

    resolve: {
        alias: {
            'three': '/node_modules/three/build/three.module.js',
            '@three/examples': '/node_modules/three/examples/jsm'
        }
    },

    optimizeDeps: {
        include: ['three']
    },

    // Rest of your config remains the same...
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
        glsl()
    ]
})