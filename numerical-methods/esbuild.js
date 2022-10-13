/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-useless-concat */
const { build } = require('esbuild');

const start = Date.now();

try {
    build({
        bundle: true,
        entryPoints: ['./src/'],
        external: ['./node_modules/*'],
        format: 'esm',
        keepNames: true,
        minify: true,
        outfile: 'dist/index.mjs',
        platform: 'node',
    }).then(() => console.log('⚡ ' + '\x1b[32m' + `Done in ${Date.now() - start}ms`));
} catch (e) {
    console.log(e);
    process.exit(1);
}
