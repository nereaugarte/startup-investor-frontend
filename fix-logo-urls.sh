#!/bin/bash

# Fix broken logo URLs with working alternatives

TABLE_NAME="startup-investor-platform-dev-startups"
REGION="eu-north-1"

echo "=========================================="
echo "🔧 Fixing Broken Logo URLs"
echo "=========================================="
echo ""

# Get all startups
aws dynamodb scan \
  --table-name $TABLE_NAME \
  --region $REGION \
  --output json > all_startups.json

# Function to update logo
update_logo() {
    local name=$1
    local logo_url=$2
    
    startup_id=$(cat all_startups.json | jq -r ".Items[] | select(.name.S == \"$name\") | .startup_id.S" | head -1)
    
    if [ ! -z "$startup_id" ]; then
        echo "Updating $name logo..."
        aws dynamodb update-item \
          --table-name $TABLE_NAME \
          --region $REGION \
          --key "{\"startup_id\": {\"S\": \"$startup_id\"}}" \
          --update-expression "SET logo_url = :logo" \
          --expression-attribute-values "{\":logo\": {\"S\": \"$logo_url\"}}" \
          --no-cli-pager > /dev/null 2>&1
        echo "  ✅ Updated"
    fi
}

# Update logos with better URLs
update_logo "Airtable" "https://logo.clearbit.com/airtable.com"
update_logo "Calendly" "https://logo.clearbit.com/calendly.com"
update_logo "Instacart" "https://logo.clearbit.com/instacart.com"
update_logo "Chime" "https://logo.clearbit.com/chime.com"
update_logo "Faire" "https://logo.clearbit.com/faire.com"
update_logo "Gusto" "https://logo.clearbit.com/gusto.com"
update_logo "Rippling" "https://logo.clearbit.com/rippling.com"

rm -f all_startups.json

echo ""
echo "✅ Logo URLs fixed!"
echo "Refresh your app to see updated logos"
echo ""

