const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_i9u5ktIZO',
      userPoolClientId: '7qotnh46vnabucl081ajb5r8mg',  // Fixed: 081 not 08i
      signUpVerificationMethod: 'code' as const,
    }
  }
};

export default awsConfig;
