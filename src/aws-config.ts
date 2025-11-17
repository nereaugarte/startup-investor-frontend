const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_i9u5ktIZO',
      userPoolClientId: '7qotnh46vnabucl081ajb5r8mg',
      signUpVerificationMethod: 'code' as const,
    }
  }
};

// Export API URL separately (not part of Amplify config)
export const API_URL = 'https://qpi7b5bcva.execute-api.us-east-1.amazonaws.com/dev';

export default awsConfig;
