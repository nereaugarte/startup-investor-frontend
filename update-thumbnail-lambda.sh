#!/bin/bash

# Update thumbnail Lambda with proper code and Pillow layer

FUNCTION_NAME="startup-investor-platform-dev-thumbnail-generator"
REGION="eu-north-1"

echo "=========================================="
echo "📦 Updating Thumbnail Lambda"
echo "=========================================="
echo ""

# Create deployment package
echo "Creating deployment package..."
cd /tmp
rm -rf lambda_package lambda_package.zip
mkdir lambda_package

# Copy Lambda code
cp /mnt/user-data/outputs/lambda_function.py lambda_package/

# Create zip
cd lambda_package
zip -r ../lambda_package.zip .
cd /tmp

echo "✅ Package created: lambda_package.zip"
echo ""

# Update Lambda function code
echo "Updating Lambda function code..."
aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb:///tmp/lambda_package.zip \
  --region $REGION \
  --no-cli-pager

echo ""
echo "✅ Lambda code updated!"
echo ""

# Add Pillow Layer (public layer available in eu-north-1)
echo "Adding Pillow Layer..."
aws lambda update-function-configuration \
  --function-name $FUNCTION_NAME \
  --layers "arn:aws:lambda:eu-north-1:770693421928:layer:Klayers-p311-pillow:3" \
  --region $REGION \
  --no-cli-pager

echo ""
echo "=========================================="
echo "✅ Lambda Updated Successfully!"
echo "=========================================="
echo ""
echo "Test it by uploading an image:"
echo "aws s3 cp image.png s3://startup-investor-platform-dev-assets-459329362476/uploads/image.png"
echo ""

# Cleanup
rm -rf /tmp/lambda_package /tmp/lambda_package.zip

