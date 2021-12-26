import {resolve} from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import rollupPluginNodeResolve from 'rollup-plugin-node-resolve';
import rollupPluginReplace from 'rollup-plugin-replace';
import rollupPluginCommonjs from 'rollup-plugin-commonjs';
import {ConfigEnv} from "vite";
import {UserConfig} from "vite";

export default defineConfig(function ({mode, command}) {
    return {
        //默认： process.cwd(),项目根目录（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。
        root: process.cwd(),
        base: '/',
        mode: mode,
        publicDir: 'public',
        build: {
            external: [
                /node_modules/
            ],
            // brotliSize:false,
            target: [
                'es2015'
            ],
            rollupOptions: {
                input: {
                    popup: resolve(__dirname, './src/popup/index.html'),
                    options: resolve(__dirname, './src/options.html'),
                    background: resolve(__dirname, './src/background.ts'),
                    "content-script": resolve(__dirname, './src/injectable-scripts/index.ts'),
                    // "turndown": resolve(__dirname, './src/injectable-scripts/turndown.js'),
                    // "turndown-plugin-gfm": resolve(__dirname, './src/injectable-scripts/turndown-plugin-gfm.js'),
                },
                output: {
                    format: 'es',
                    // 定义入口模块的打包格式
                    entryFileNames: 'assets/[name].js',
                    // 定义资源的打包格式

                    assetFileNames: 'assets/[name]-[hash][extname]',
                    // 定义经过代码分块，即动态导入资源的打包格式
                    chunkFileNames: 'assets/[name]-[hash].js',
                    manualChunks(id, {getModuleInfo}) {
                        // console.log(id)
                        // if(!id.includes('/vite-learn-tutorial/src/utils')){
                        //     console.log("moduleId",id)
                        //     return "vendor-1"
                        // }

                        // const disableSplitChunkRules = new Set([
                        //     /\/vite-learn-tutorial\/src\/utils\/*/,
                        //     /\/node_modules\/turndown/,
                        //     /\/node_modules\/turndown-plugin-gfm/
                        // ])
                        // if (id.includes('node_modules')) {
                        //     return 'parent';
                        // }
                        // console.log("moduleID",id)
                        // if(!id.includes('node_modules/turndown') &&
                        //     !id.includes('node_modules/turndown-plugin-gfm') &&
                        //     !id.includes(resolve(__dirname,'./src/utils/'))
                        // ){
                        //     return 'vendor'
                        // }
                    },
                    // inlineDynamicImports: true
                    hoistTransitiveImports:false,

                },


            },
            polyfillModulePreload: false
        },
        resolve: {
            alias: {
                '@': './src/'
            }
        },
        css: {},
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            rollupPluginCommonjs(),
            rollupPluginNodeResolve()
        ]
    }
})

