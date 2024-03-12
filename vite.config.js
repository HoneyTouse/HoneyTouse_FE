import multiInput from "rollup-plugin-multi-input";

export default {
    root: 'pages',
    publicDir: '../public',
    build: {
        target: 'esnext',
        outDir: '../dist',
        rollupOptions: {
            input: [
                'pages/**/*.html'
            ],
            plugins: [multiInput.default()],
        },
    },
    server: {
        port: 8080,
    }
}
