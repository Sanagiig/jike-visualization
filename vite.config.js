import path from "path"
import fs from "fs"
import {defineConfig} from "vite"
import topLevelAwait from "vite-plugin-top-level-await"

function readHtml(path) {
    const htmlReg = /\.html$/
    const files = fs.readdirSync(path)
    const res = []
    files.forEach(file => {
        const filepath = path + "/" + file
        if (fs.statSync(filepath).isDirectory()) {
            res.push(...readHtml(filepath))
        } else if (htmlReg.test(file)) {
            res.push(filepath)
        }
    })
    return res
}

const inputFiles = readHtml(path.join(__dirname, "src")).reduce((res, cur, i) => {
    const htmlFileName = cur.split("/").slice(-2)
    const name = i + cur.split("/").slice(-2)
    // res.push({
    //     template: cur,
    //     entry: cur.replace(htmlFileName, "") + "main.ts",
    //     filename: i + ".html"
    // });
    res[name] = cur
    return res
}, {})

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    plugins: [
        topLevelAwait({
            // The export name of top-level await promise for each chunk module
            promiseExportName: '__tla',
            // The function to generate import names of top-level await promise in each chunk module
            promiseImportName: i => `__tla_${i}`
        })
    ],
    build: {
        rollupOptions: {
            input: {
                index: "./index.html",
                ...inputFiles
            },
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
            }
        },
    },
})