#!/bin/bash

# Add a test investor profile to DynamoDB

echo "=========================================="
echo "🧪 Adding Test Investor Profile"
echo "=========================================="
echo ""

TABLE_NAME="startup-investor-platform-dev-investors"
REGION="eu-north-1"
EMAIL="nugartejauregui@gmail.com"

echo "Creating investor profile for: $EMAIL"
echo ""

# Create investor item
aws dynamodb put-item \
  --table-name $TABLE_NAME \
  --region $REGION \
  --item '{
    "investor_id": {"S": "nugartejauregui@gmail.com"},
    "email": {"S": "nugartejauregui@gmail.com"},
    "name": {"S": "Nerea"},
    "preferred_industries": {"L": [
      {"S": "Artificial Intelligence"},
      {"S": "FinTech"},
      {"S": "Productivity"}
    ]},
    "preferred_funding_stages": {"L": [
      {"S": "Series A"},
      {"S": "Series B"},
      {"S": "Series C"}
    ]},
    "min_investment": {"N": "100000"},
    "max_investment": {"N": "10000000"},
    "created_at": {"S": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"},
    "updated_at": {"S": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}'
  }

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ Test Investor Profile Created!"
    echo "=========================================="
    echo ""
    echo "Email: $EMAIL"
    echo "Interests: AI, FinTech, Productivity"
    echo "Stages: Series A, B, C"
    echo "Investment: $100K - $10M"
    echo ""
    echo "Now run the matching Lambda:"
    echo ""
    echo "aws lambda invoke \\"
    echo "  --function-name startup-investor-platform-dev-startup-matcher \\"
    echo "  --region eu-north-1 \\"
    echo "  response.json && cat response.json"
    echo ""
else
    echo "❌ Error creating investor profile"
    exit 1
fi
