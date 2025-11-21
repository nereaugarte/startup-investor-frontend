# 🚀 Frontend Deployment Guide

This guide explains how to deploy the React frontend to AWS using S3 and CloudFront.

## Architecture Overview

The frontend is deployed using:
- **Amazon S3**: Hosts the static files (HTML, CSS, JS, images)
- **Amazon CloudFront**: CDN that serves the content globally with HTTPS

### Why S3 + CloudFront?

✅ **S3 Static Hosting**: Perfect for React SPAs - cost-effective, scalable, serverless  
✅ **CloudFront CDN**: 
   - Global content delivery (faster load times)
   - HTTPS/SSL certificates included
   - DDoS protection
   - Custom domain support
   - Intelligent caching
   - SPA routing support (404 → index.html)

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   aws --version
   aws configure
   ```

2. **Node.js and npm** installed
   ```bash
   node --version
   npm --version
   ```

3. **AWS Account** with appropriate permissions:
   - CloudFormation (create/update stacks)
   - S3 (create buckets, upload files)
   - CloudFront (create distributions, invalidate cache)
   - IAM (create roles/policies)

## Quick Start

### 1. Build the Application

```bash
cd frontend
npm install
npm run build
```

This creates a `build/` directory with production-ready files.

### 2. Deploy Infrastructure

The deployment script handles everything automatically:

```bash
./deploy.sh [environment] [stack-name]
```

**Examples:**
```bash
# Deploy to dev environment (default)
./deploy.sh

# Deploy to production
./deploy.sh prod startup-investor-platform-frontend-prod

# Deploy to staging
./deploy.sh staging startup-investor-platform-frontend-staging
```

### 3. What the Script Does

1. ✅ Builds the React application
2. ✅ Creates/updates CloudFormation stack (S3 + CloudFront)
3. ✅ Uploads files to S3 with proper cache headers
4. ✅ Invalidates CloudFront cache
5. ✅ Displays the deployment URL

## Manual Deployment

If you prefer to deploy manually:

### Step 1: Create CloudFormation Stack

```bash
aws cloudformation create-stack \
  --stack-name startup-investor-platform-frontend-dev \
  --template-body file://frontend-infrastructure.yaml \
  --parameters ParameterKey=Environment,ParameterValue=dev \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

### Step 2: Wait for Stack Creation

```bash
aws cloudformation wait stack-create-complete \
  --stack-name startup-investor-platform-frontend-dev \
  --region us-east-1
```

### Step 3: Get Bucket Name

```bash
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name startup-investor-platform-frontend-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text \
  --region us-east-1)

echo $BUCKET_NAME
```

### Step 4: Upload Files to S3

```bash
# Upload static assets with long cache
aws s3 sync build/ s3://$BUCKET_NAME/ \
  --delete \
  --exclude "index.html" \
  --exclude "asset-manifest.json" \
  --cache-control "public, max-age=31536000, immutable" \
  --region us-east-1

# Upload index.html with no cache
aws s3 cp build/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html" \
  --region us-east-1
```

### Step 5: Invalidate CloudFront Cache

```bash
DIST_ID=$(aws cloudformation describe-stacks \
  --stack-name startup-investor-platform-frontend-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text \
  --region us-east-1)

aws cloudfront create-invalidation \
  --distribution-id $DIST_ID \
  --paths "/*" \
  --region us-east-1
```

## Configuration

### Environment Variables

Before building, make sure your `src/aws-config.ts` has the correct AWS configuration:

```typescript
export default {
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'your-user-pool-id',
  aws_user_pools_web_client_id: 'your-client-id',
  // ... other config
};
```

### CloudFormation Parameters

Edit `frontend-infrastructure.yaml` to customize:

- **Environment**: Environment name (dev, staging, prod)
- **DomainName**: Optional custom domain (requires ACM certificate)

### Custom Domain Setup

To use a custom domain:

1. **Request SSL Certificate in ACM** (must be in `us-east-1` region):
   ```bash
   aws acm request-certificate \
     --domain-name app.example.com \
     --validation-method DNS \
     --region us-east-1
   ```

2. **Update CloudFormation template** - uncomment and configure:
   ```yaml
   ViewerCertificate:
     AcmCertificateArn: !Ref SSLCertificate
     SslSupportMethod: sni-only
     MinimumProtocolVersion: TLSv1.2_2021
   ```

3. **Add Route53 alias** pointing to CloudFront distribution

## Cache Strategy

The deployment uses an optimized caching strategy:

- **Static assets** (JS, CSS, images): 1 year cache
  - Files have content hashes, so safe to cache long-term
- **index.html**: No cache (always fresh)
  - Ensures users get latest version
- **CloudFront**: Additional caching layer
  - Reduces origin requests
  - Global edge locations

## Updating the Deployment

To update after making changes:

```bash
# 1. Make your code changes
# 2. Rebuild
npm run build

# 3. Redeploy
./deploy.sh
```

The script will:
- Update CloudFormation if needed
- Upload new files to S3
- Invalidate CloudFront cache
- New version will be live in ~5-10 minutes

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CloudFormation Stack Fails

Check CloudFormation events:
```bash
aws cloudformation describe-stack-events \
  --stack-name startup-investor-platform-frontend-dev \
  --region us-east-1
```

### Files Not Updating

1. Check S3 bucket contents:
   ```bash
   aws s3 ls s3://your-bucket-name/ --recursive
   ```

2. Check CloudFront invalidation status:
   ```bash
   aws cloudfront list-invalidations \
     --distribution-id YOUR_DIST_ID \
     --region us-east-1
   ```

3. Clear browser cache or use incognito mode

### 404 Errors on Routes

The CloudFormation template includes custom error responses that redirect 404s to `index.html` for SPA routing. If you're still seeing 404s:

1. Verify CloudFormation stack has the custom error responses
2. Wait for CloudFront propagation (can take 15-20 minutes)
3. Check that index.html is in the S3 bucket root

## Cost Estimation

For a typical deployment:

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| S3 Storage | ~10 MB | $0.00 |
| S3 Requests | 10,000 GET | $0.00 |
| CloudFront | 10 GB transfer | ~$0.85 |
| CloudFront Requests | 100,000 | ~$0.01 |
| **Total** | | **~$0.86/month** |

*Costs scale with traffic. First 1 TB/month of CloudFront data transfer is free in some regions.*

## Security Best Practices

✅ **S3 Bucket**: Private (not publicly accessible)  
✅ **CloudFront OAI**: Only CloudFront can access S3  
✅ **HTTPS**: Enforced via CloudFront  
✅ **CORS**: Configured for API access  
✅ **No sensitive data**: All config in environment variables  

## Monitoring

### CloudWatch Metrics

Monitor:
- CloudFront requests
- CloudFront errors (4xx, 5xx)
- S3 requests
- Cache hit ratio

### Alarms

Set up CloudWatch alarms for:
- High error rates
- Unusual traffic spikes
- Distribution status changes

## Rollback

To rollback to a previous version:

1. **S3 Versioning** is enabled - restore previous version:
   ```bash
   aws s3api list-object-versions \
     --bucket your-bucket-name \
     --prefix index.html
   ```

2. **CloudFormation** - revert stack to previous version:
   ```bash
   aws cloudformation update-stack \
     --stack-name startup-investor-platform-frontend-dev \
     --use-previous-template
   ```

## Next Steps

- [ ] Set up custom domain
- [ ] Configure CloudWatch alarms
- [ ] Set up CI/CD pipeline (GitHub Actions, CodePipeline)
- [ ] Add monitoring and logging
- [ ] Configure WAF for additional security

## Support

For issues or questions:
- Check CloudFormation stack events
- Review CloudWatch logs
- Verify AWS credentials and permissions
- Check the [AWS documentation](https://docs.aws.amazon.com/)

