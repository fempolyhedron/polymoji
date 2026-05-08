# polymoji
npx esbuild ./src/polymoji.ts --bundle --format=esm --outfile=./dist/polymoji.js --sourcemap
npx tsc

# plugins
npx esbuild ./plugins/twemoji_font.ts --bundle --format=esm --outfile=./dist/plugins/twemoji_font.js
npx esbuild ./plugins/pride_flags.ts --bundle --format=esm --outfile=./dist/plugins/pride_flags.js
npx esbuild ./plugins/linux_distros.ts --bundle --format=esm --outfile=./dist/plugins/linux_distros.js

cp LICENCE ./dist/LICENCE

printf "build completed\n"
build=$(($(cat build.txt) + 1))
printf "0x%x" "$build" > build.txt
printf "you are using 0.1-dev build %x\n\n" "$build"
printf "(c) FemPolyhedron & contribs - 2026\n\n%s" "$(cat LICENCE)"