// aws-config.ts
export const USER_POOL_ID = 'eu-north-1_hL9v6t8kt';
export const USER_POOL_CLIENT_ID = '17e22khf98gq48rkanl9k3lv2t';
export const AWS_REGION = 'eu-north-1';
export const API_URL = 'https://d21v303lo0.execute-api.eu-north-1.amazonaws.com/dev';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: USER_POOL_CLIENT_ID,
      region: AWS_REGION,
    }
  },
  API: {
    REST: {
      'StartupAPI': {
        endpoint: API_URL,
        region: AWS_REGION,
      }
    }
  }
};

export default awsConfig;
