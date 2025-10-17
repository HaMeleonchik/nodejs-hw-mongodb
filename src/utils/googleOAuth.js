import { OAuth2Client } from 'google-auth-library';
import { getEnvVariable } from './getEnvVariable.js';

const client = new OAuth2Client({
  clientId: getEnvVariable('CLIENT_ID'),
  clientSecret: getEnvVariable('CLIENT_SECRET'),
  redirectUri: getEnvVariable('REDIRECT_URI'),
});

export function getOAuthUrl() {
  return client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  const response = await client.getToken(code);

  return client.verifyIdToken({
    idToken: response.tokens.id_token,
  });
}
