# 🔗 Backend Integration Notes

## Current Backend Setup

Your backend infrastructure is already deployed in **eu-north-1** with:
- ✅ DynamoDB tables (Startups, Investors)
- ✅ Lambda functions (API handler, matcher, email sender, etc.)
- ✅ Step Functions state machines
- ✅ API Gateway: `https://d21v303lo0.execute-api.eu-north-1.amazonaws.com/dev`
- ✅ Cognito User Pool: `eu-north-1_hL9v6t8kt`
- ✅ SES for email notifications

## Frontend Integration

The frontend is configured to connect to your existing backend:

### AWS Configuration (`src/aws-config.ts`)
```typescript
- Region: eu-north-1
- API Gateway: https://d21v303lo0.execute-api.eu-north-1.amazonaws.com/dev
- Cognito User Pool: eu-north-1_hL9v6t8kt
```

### CORS Configuration

✅ **Already configured!** Your Lambda function (`api-handler`) includes CORS headers:
```python
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Headers': 'Content-Type,Authorization'
'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
```

This means your CloudFront frontend will be able to make API calls to your backend.

### What the Frontend Deployment Does

The frontend deployment **does NOT**:
- ❌ Create or modify any backend resources
- ❌ Interfere with DynamoDB, Lambda, Step Functions, or SES
- ❌ Change API Gateway configuration
- ❌ Modify Cognito settings

The frontend deployment **only**:
- ✅ Creates a new S3 bucket for frontend files
- ✅ Creates a CloudFront distribution
- ✅ Uploads your React build files

**Your backend remains completely untouched!**

## Deployment Process

1. **Build frontend** → Creates `build/` folder with static files
2. **Deploy infrastructure** → Creates S3 + CloudFront (separate stack)
3. **Upload files** → Puts files in S3
4. **Invalidate cache** → Clears CloudFront cache

The frontend will automatically connect to your existing backend using the configuration in `aws-config.ts`.

## After Deployment

Once deployed, your frontend will:
- ✅ Authenticate users via your existing Cognito User Pool
- ✅ Make API calls to your existing API Gateway
- ✅ Access your DynamoDB tables (via Lambda)
- ✅ Trigger Step Functions workflows
- ✅ Send emails via SES

## Security Note

Currently, CORS is set to `*` (allow all origins). For production, consider restricting to your CloudFront domain:

```python
'Access-Control-Allow-Origin': 'https://your-cloudfront-domain.cloudfront.net'
```

But for now, `*` will work fine for development and testing.

## Troubleshooting

If you see CORS errors after deployment:
1. Check that API Gateway has CORS enabled (not just Lambda)
2. Verify the API Gateway endpoint in `aws-config.ts` is correct
3. Check browser console for specific CORS error messages

## Next Steps

1. Deploy frontend: `./deploy.sh`
2. Test authentication with your Cognito User Pool
3. Test API calls to your API Gateway
4. Verify end-to-end functionality

Your backend is ready - the frontend will connect seamlessly! 🚀

