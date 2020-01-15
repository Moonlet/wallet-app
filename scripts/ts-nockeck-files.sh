#!/bin/bash

FILES=(
    "node_modules/react-native-draggable-flatlist/index.tsx"
    "node_modules/react-native-draggable-flatlist/procs.tsx"
)

echo "Patching files...";
for file in "${FILES[@]}"; do
    echo "Adding //ts-nocheck to $file..."
    grep -q "//@ts-nocheck" "$file" || printf "//@ts-nocheck\n\n%s" "$(cat "$file")" > "$file"
done
echo "Done."