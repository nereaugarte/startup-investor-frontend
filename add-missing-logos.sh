#!/bin/bash

# Add missing logos

TABLE_NAME="startup-investor-platform-dev-startups"
REGION="eu-north-1"

echo "Adding missing logos..."

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
        echo "Adding $name logo..."
        aws dynamodb update-item \
          --table-name $TABLE_NAME \
          --region $REGION \
          --key "{\"startup_id\": {\"S\": \"$startup_id\"}}" \
          --update-expression "SET logo_url = :logo" \
          --expression-attribute-values "{\":logo\": {\"S\": \"$logo_url\"}}" \
          --no-cli-pager > /dev/null 2>&1
        echo "  ✅ Done"
    fi
}

# Add missing logos
update_logo "Databricks" "https://logo.clearbit.com/databricks.com"
update_logo "Linear" "https://logo.clearbit.com/linear.app"
update_logo "Navan" "https://logo.clearbit.com/navan.com"
update_logo "Plaid" "https://logo.clearbit.com/plaid.com"
update_logo "Ramp" "https://logo.clearbit.com/ramp.com"
update_logo "Retool" "https://logo.clearbit.com/retool.com"
update_logo "Webflow" "https://logo.clearbit.com/webflow.com"

rm -f all_startups.json

echo ""
echo "✅ All logos added!"
echo ""

