export interface Auth0Config {
  domain: string;
  clientId: string;
  audience?: string;
  scope?: string;
}

export const auth0Config: Auth0Config = {
  domain: 'dev-au2yf8c1n0hrml0i.us.auth0.com',
  clientId: 'znQ75mgsF3FAvWJl0EA36eQBKHlG2UIh',
  audience: '', // Leave empty for standard user authentication
  scope: 'openid profile email', // Standard scope for user info
};

// URL scheme for deep linking (matches app.json scheme)
export const urlScheme = 'roomait';

// Auth0 endpoints
export const auth0Endpoints = {
  authorization: `https://${auth0Config.domain}/authorize`,
  token: `https://${auth0Config.domain}/oauth/token`,
  userInfo: `https://${auth0Config.domain}/userinfo`,
  logout: `https://${auth0Config.domain}/v2/logout`,
};
