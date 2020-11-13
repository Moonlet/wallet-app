
echo "Patching superstruct node_modules...";
mv node_modules/superstruct/lib/index.cjs node_modules/superstruct/lib/index.js
mv node_modules/superstruct/lib/index.cjs.map node_modules/superstruct/lib/index.js.map
awk '{sub("index.cjs", "index.js")}1' node_modules/superstruct/package.json > tmp.json && mv tmp.json node_modules/superstruct/package.json
echo "Done";