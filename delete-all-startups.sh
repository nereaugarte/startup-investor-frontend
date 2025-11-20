#!/bin/bash
TABLE_NAME="startup-investor-platform-dev-startups"
REGION="eu-north-1"

echo "Deleting all startups..."
aws dynamodb scan \
  --table-name $TABLE_NAME \
  --region $REGION \
  --projection-expression "startup_id" \
  --output json | jq -r '.Items[].startup_id.S' | while read id; do
    aws dynamodb delete-item \
      --table-name $TABLE_NAME \
      --key "{\"startup_id\": {\"S\": \"$id\"}}" \
      --region $REGION \
      --no-cli-pager > /dev/null 2>&1
    echo "Deleted: $id"
done

echo "✅ All deleted!"
