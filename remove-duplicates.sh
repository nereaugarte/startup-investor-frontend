#!/bin/bash

# Remove duplicate startups from DynamoDB - keep only ONE of each

TABLE_NAME="startup-investor-platform-dev-startups"
REGION="eu-north-1"

echo "=========================================="
echo "🧹 Removing Duplicate Startups"
echo "=========================================="
echo ""

# Get all startups
echo "Fetching all startups..."
aws dynamodb scan \
  --table-name $TABLE_NAME \
  --region $REGION \
  --output json > all_startups.json

TOTAL=$(cat all_startups.json | jq '.Items | length')
echo "Total items in database: $TOTAL"
echo ""

# Get unique startup names
UNIQUE_NAMES=$(cat all_startups.json | jq -r '.Items[].name.S' | sort | uniq)
UNIQUE_COUNT=$(echo "$UNIQUE_NAMES" | wc -l | tr -d ' ')

echo "Unique startup names: $UNIQUE_COUNT"
echo ""

# Create list of IDs to KEEP (first occurrence of each name)
echo "Building list of items to keep..."
cat all_startups.json | jq -r '.Items[] | "\(.name.S)|\(.startup_id.S)"' | \
  awk -F'|' '!seen[$1]++ { print $2 }' > keep_ids.txt

KEEP_COUNT=$(wc -l < keep_ids.txt | tr -d ' ')
echo "Items to keep: $KEEP_COUNT"

# Create list of ALL IDs
cat all_startups.json | jq -r '.Items[].startup_id.S' > all_ids.txt

# Find IDs to DELETE (all IDs except the ones to keep)
grep -v -f keep_ids.txt all_ids.txt > delete_ids.txt

DELETE_COUNT=$(wc -l < delete_ids.txt | tr -d ' ')
echo "Items to delete: $DELETE_COUNT"
echo ""

if [ $DELETE_COUNT -eq 0 ]; then
    echo "✅ No duplicates found!"
    rm -f all_startups.json keep_ids.txt all_ids.txt delete_ids.txt
    exit 0
fi

echo "This will delete $DELETE_COUNT duplicate startups."
echo "Press Ctrl+C to cancel, or press Enter to continue..."
read

echo ""
echo "🗑️  Deleting duplicates..."
echo ""

DELETED=0
while IFS= read -r startup_id; do
    if [ ! -z "$startup_id" ]; then
        aws dynamodb delete-item \
          --table-name $TABLE_NAME \
          --key "{\"startup_id\": {\"S\": \"$startup_id\"}}" \
          --region $REGION \
          --no-cli-pager > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            DELETED=$((DELETED + 1))
            echo "  Deleted $DELETED/$DELETE_COUNT"
        fi
    fi
done < delete_ids.txt

# Cleanup
rm -f all_startups.json keep_ids.txt all_ids.txt delete_ids.txt

echo ""
echo "=========================================="
echo "✅ Cleanup Complete!"
echo "=========================================="
echo "Deleted: $DELETED duplicates"
echo "Remaining: $KEEP_COUNT unique startups"
echo ""
echo "Refresh your app to see only unique startups!"
echo ""

