#!/bin/bash

# Directory to search (use "." for current directory)
DIR="."

# Initialize counter
index=0

# Loop through files starting with "anon" (excluding already renamed ones)
for file in "$DIR"/anon*; do
    # Check if it's a regular file
    if [[ -f "$file" ]]; then
        mv "$file" "$DIR/anon$index.png"
        ((index++))
    fi
done

