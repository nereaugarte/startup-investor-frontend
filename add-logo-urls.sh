#!/bin/bash

# Add logo URLs to startups - handles duplicates by updating first match only

TABLE_NAME="startup-investor-platform-dev-startups"
REGION="eu-north-1"

echo "=========================================="
echo "🎨 Adding Logo URLs to Startups"
echo "=========================================="
echo ""

# Get all startups
echo "Fetching startups from DynamoDB..."
aws dynamodb scan \
  --table-name $TABLE_NAME \
  --region $REGION \
  --output json > all_startups.json

STARTUP_COUNT=$(cat all_startups.json | jq '.Items | length')
echo "Found $STARTUP_COUNT startups in database"
echo ""

UPDATED=0

# Function to update ONE startup with logo URL (first match only)
update_startup() {
    local name=$1
    local logo_url=$2
    
    echo "Updating: $name"
    
    # Find FIRST startup by name (head -1 to get only first match)
    startup_id=$(cat all_startups.json | jq -r ".Items[] | select(.name.S == \"$name\") | .startup_id.S" | head -1)
    
    if [ ! -z "$startup_id" ]; then
        echo "  ID: $startup_id"
        
        aws dynamodb update-item \
          --table-name $TABLE_NAME \
          --region $REGION \
          --key "{\"startup_id\": {\"S\": \"$startup_id\"}}" \
          --update-expression "SET logo_url = :logo" \
          --expression-attribute-values "{\":logo\": {\"S\": \"$logo_url\"}}" \
          --no-cli-pager
        
        if [ $? -eq 0 ]; then
            echo "  ✅ Updated!"
            return 0
        else
            echo "  ❌ Failed"
            return 1
        fi
    else
        echo "  ⚠️  Not found"
        return 1
    fi
}

# Update each startup (one by one)
echo "Updating startups with logo URLs..."
echo ""

update_startup "Stripe" "https://cdn.brandfetch.io/stripe.com/w/400/h/400/logo" && UPDATED=$((UPDATED + 1))
update_startup "Notion" "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" && UPDATED=$((UPDATED + 1))
update_startup "Figma" "https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png" && UPDATED=$((UPDATED + 1))
update_startup "Discord" "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" && UPDATED=$((UPDATED + 1))
update_startup "Canva" "https://static.canva.com/web/images/12487a1e0770d29351bd4ce4f87ec8fe.svg" && UPDATED=$((UPDATED + 1))
update_startup "Airtable" "https://seeklogo.com/images/A/airtable-logo-216B9AF035-seeklogo.com.png" && UPDATED=$((UPDATED + 1))
update_startup "Anthropic" "https://www.anthropic.com/_next/image?url=%2Fimages%2Ficons%2Fapple-touch-icon.png&w=256&q=75" && UPDATED=$((UPDATED + 1))
update_startup "Brex" "https://cdn.worldvectorlogo.com/logos/brex-1.svg" && UPDATED=$((UPDATED + 1))
update_startup "Databricks" "https://asset.brandfetch.io/idAnDTFapY/id0ty2LLq5.png" && UPDATED=$((UPDATED + 1))
update_startup "Instacart" "https://corporate.instacart.com/wp-content/uploads/2022/11/instacart-logo-color.png" && UPDATED=$((UPDATED + 1))
update_startup "Plaid" "https://cdn.worldvectorlogo.com/logos/plaid.svg" && UPDATED=$((UPDATED + 1))
update_startup "Chime" "https://www.chime.com/wp-content/uploads/2021/03/chime-logo-green.svg" && UPDATED=$((UPDATED + 1))
update_startup "Rippling" "https://asset.brandfetch.io/idK-gvTD7k/id2ph6qMkB.png" && UPDATED=$((UPDATED + 1))
update_startup "Faire" "https://cdn.faire.com/static/logo-faire.svg" && UPDATED=$((UPDATED + 1))
update_startup "Revolut" "https://cdn.worldvectorlogo.com/logos/revolut.svg" && UPDATED=$((UPDATED + 1))
update_startup "Retool" "https://asset.brandfetch.io/idgHms-r_T/id_k4KgUPy.png" && UPDATED=$((UPDATED + 1))
update_startup "Webflow" "https://cdn.worldvectorlogo.com/logos/webflow-logo.svg" && UPDATED=$((UPDATED + 1))
update_startup "Snyk" "https://res.cloudinary.com/snyk/image/upload/v1537345894/press-kit/brand/logo-black.png" && UPDATED=$((UPDATED + 1))
update_startup "Gusto" "https://prod.gusto-assets.com/assets/rebrand/gusto-logo-f744e202551db44c9c4c12ebde479e72b1af8ad371273dd7bc7b60e6e2830b9c.svg" && UPDATED=$((UPDATED + 1))
update_startup "Calendly" "https://assets.calendly.com/packs/frontend/media/logo-square-cd364a3c33976d32792d.png" && UPDATED=$((UPDATED + 1))
update_startup "Gitlab" "https://cdn.worldvectorlogo.com/logos/gitlab.svg" && UPDATED=$((UPDATED + 1))
update_startup "Vercel" "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" && UPDATED=$((UPDATED + 1))
update_startup "Navan" "https://asset.brandfetch.io/idw_bBvDxl/idE4gyNq6a.png" && UPDATED=$((UPDATED + 1))
update_startup "Linear" "https://asset.brandfetch.io/idZDaL0qvU/idm0K3cJDB.png" && UPDATED=$((UPDATED + 1))
update_startup "Ramp" "https://cdn.worldvectorlogo.com/logos/ramp-2.svg" && UPDATED=$((UPDATED + 1))

# Cleanup
rm -f all_startups.json

echo ""
echo "=========================================="
echo "✅ Logo URLs Added!"
echo "=========================================="
echo "Successfully updated: $UPDATED/25 startups"
echo ""
echo "Note: You have duplicates in your database"
echo "Run remove-duplicates.sh if you want to clean them up"
echo ""

