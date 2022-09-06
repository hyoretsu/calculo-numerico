/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-useless-concat */
const { build } = require('esbuild');

const start = Date.now();

try {
    build({
        entryPoints: ['./src/'],
        bundle: true,
        keepNames: true,
        minify: true,
        outfile: 'dist/index.js',
    }).then(() => console.log('⚡ ' + '\x1b[32m' + `Done in ${Date.now() - start}ms`));
} catch (e) {
    console.log(e);
    process.exit(1);
}
