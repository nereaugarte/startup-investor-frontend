#!/bin/bash

# Deployment script for React frontend to S3 + CloudFront
# Usage: ./deploy.sh [environment] [stack-name]
# Example: ./deploy.sh dev startup-investor-platform-frontend-dev

set -e  # Exit on error

ENVIRONMENT=${1:-dev}
STACK_NAME=${2:-startup-investor-platform-frontend-${ENVIRONMENT}}

echo "🚀 Starting deployment for environment: ${ENVIRONMENT}"
echo "📦 Stack name: ${STACK_NAME}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the frontend directory.${NC}"
    exit 1
fi

# Step 1: Build the React app
echo -e "\n${YELLOW}📦 Step 1: Building React application...${NC}"
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}❌ Error: Build directory not found. Build may have failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 2: Deploy or update CloudFormation stack
echo -e "\n${YELLOW}☁️  Step 2: Deploying CloudFormation stack...${NC}"

# Check if stack exists
if aws cloudformation describe-stacks --stack-name "${STACK_NAME}" &> /dev/null; then
    echo "Stack exists, updating..."
    aws cloudformation update-stack \
        --stack-name "${STACK_NAME}" \
        --template-body file://frontend-infrastructure.yaml \
        --parameters ParameterKey=Environment,ParameterValue="${ENVIRONMENT}" \
        --capabilities CAPABILITY_IAM \
        --region eu-north-1
    
    echo "Waiting for stack update to complete..."
    aws cloudformation wait stack-update-complete --stack-name "${STACK_NAME}" --region eu-north-1
else
    echo "Stack does not exist, creating..."
    aws cloudformation create-stack \
        --stack-name "${STACK_NAME}" \
        --template-body file://frontend-infrastructure.yaml \
        --parameters ParameterKey=Environment,ParameterValue="${ENVIRONMENT}" \
        --capabilities CAPABILITY_IAM \
        --region eu-north-1
    
    echo "Waiting for stack creation to complete..."
    aws cloudformation wait stack-create-complete --stack-name "${STACK_NAME}" --region eu-north-1
fi

# Get the bucket name from stack outputs
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
    --output text \
    --region eu-north-1)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text \
    --region eu-north-1)

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text \
    --region eu-north-1)

if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}❌ Error: Could not retrieve bucket name from stack outputs${NC}"
    exit 1
fi

echo -e "${GREEN}✅ CloudFormation stack deployed successfully${NC}"
echo -e "   Bucket: ${BUCKET_NAME}"
echo -e "   Distribution ID: ${DISTRIBUTION_ID}"

# Step 3: Upload files to S3
echo -e "\n${YELLOW}📤 Step 3: Uploading files to S3...${NC}"

# Sync build files to S3 (delete removed files, exclude node_modules)
aws s3 sync build/ s3://${BUCKET_NAME}/ \
    --delete \
    --exclude "*.map" \
    --exclude "node_modules/*" \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html" \
    --exclude "asset-manifest.json" \
    --region eu-north-1

# Upload index.html and asset-manifest.json with no-cache (for cache busting)
aws s3 cp build/index.html s3://${BUCKET_NAME}/index.html \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html" \
    --region eu-north-1

if [ -f "build/asset-manifest.json" ]; then
    aws s3 cp build/asset-manifest.json s3://${BUCKET_NAME}/asset-manifest.json \
        --cache-control "public, max-age=0, must-revalidate" \
        --content-type "application/json" \
        --region eu-north-1
fi

echo -e "${GREEN}✅ Files uploaded to S3${NC}"

# Step 4: Invalidate CloudFront cache
echo -e "\n${YELLOW}🔄 Step 4: Invalidating CloudFront cache...${NC}"

# Note: CloudFront API is global, but we use us-east-1 for API calls
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "${DISTRIBUTION_ID}" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo "Invalidation created: ${INVALIDATION_ID}"
echo "Waiting for invalidation to complete (this may take a few minutes)..."

aws cloudfront wait invalidation-completed \
    --distribution-id "${DISTRIBUTION_ID}" \
    --id "${INVALIDATION_ID}"

echo -e "${GREEN}✅ Cache invalidation completed${NC}"

# Step 5: Display results
echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "\n📋 Deployment Summary:"
echo -e "   Environment: ${ENVIRONMENT}"
echo -e "   Stack Name: ${STACK_NAME}"
echo -e "   S3 Bucket: ${BUCKET_NAME}"
echo -e "   CloudFront Distribution: ${DISTRIBUTION_ID}"
echo -e "   Frontend URL: ${CLOUDFRONT_URL}"
echo -e "\n🌐 Your application is now live at: ${GREEN}${CLOUDFRONT_URL}${NC}"
echo -e "\n💡 Note: It may take a few minutes for changes to propagate globally."

