#!/bin/bash

# Directory containing images
IMAGES_DIR="images"

# Output JSON file
OUTPUT_FILE="images.json"

# Function to generate JSON list
generate_json() {
    echo "[" > "$OUTPUT_FILE"
    first=1
    for file in "$IMAGES_DIR"/*.{jpg,jpeg,png,gif}; do
        # Check if the file exists to avoid literal patterns if no files match
        if [[ -f "$file" ]]; then
            filename=$(basename "$file")
            if [[ $first -eq 1 ]]; then
                first=0
            else
                echo "," >> "$OUTPUT_FILE"
            fi
            echo "  \"$filename\"" >> "$OUTPUT_FILE"
        fi
    done
    echo "]" >> "$OUTPUT_FILE"
}

# Initial generation
generate_json

# Monitor the directory for changes and regenerate JSON on events
inotifywait -m -e create -e delete -e moved_to -e moved_from "$IMAGES_DIR" --format '%w%f' |
while read -r file; do
    generate_json
done
