#!/bin/bash

# Cleanup script - removes one-time/development scripts that are no longer needed

echo "🧹 Cleaning up unnecessary scripts..."
echo ""

# Scripts to delete (one-time migrations/fixes)
SCRIPTS_TO_DELETE=(
    "add-logo-urls.sh"
    "add-missing-logos.sh"
    "fix-logo-urls.sh"
    "remove-duplicates.sh"
    "delete-all-startups.sh"
    "add-test-investor.sh"
    "update-thumbnail-lambda.sh"
)

# Files to delete
FILES_TO_DELETE=(
    "vercel.json"  # Not using Vercel anymore
    "response.json"  # Unknown purpose, likely test data
)

DELETED_COUNT=0
KEPT_COUNT=0

echo "📋 Scripts to delete:"
for script in "${SCRIPTS_TO_DELETE[@]}"; do
    if [ -f "$script" ]; then
        echo "  ❌ $script"
        read -p "    Delete this script? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm "$script"
            echo "    ✅ Deleted"
            ((DELETED_COUNT++))
        else
            echo "    ⏭️  Kept"
            ((KEPT_COUNT++))
        fi
    fi
done

echo ""
echo "📋 Files to delete:"
for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        echo "  ❌ $file"
        read -p "    Delete this file? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm "$file"
            echo "    ✅ Deleted"
            ((DELETED_COUNT++))
        else
            echo "    ⏭️  Kept"
            ((KEPT_COUNT++))
        fi
    fi
done

echo ""
echo "✨ Cleanup complete!"
echo "   Deleted: $DELETED_COUNT files"
echo "   Kept: $KEPT_COUNT files"
echo ""
echo "✅ Essential scripts kept:"
echo "   - deploy.sh (frontend deployment)"

