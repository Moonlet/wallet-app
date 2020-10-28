
echo "Patching superstruct node_modules...";
mv node_modules/superstruct/lib/index.cjs.js node_modules/superstruct/lib/index.js
mv node_modules/superstruct/lib/index.cjs.js.map node_modules/superstruct/lib/index.js.map
awk '{sub("index.cjs.js", "index.js")}1' node_modules/superstruct/package.json > tmp.json && mv tmp.json node_modules/superstruct/package.json
echo "Done";