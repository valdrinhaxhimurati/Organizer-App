import { PublicClientApplication, type AccountInfo, type Configuration } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_MSAL_CLIENT_ID ?? '';

/** True only when VITE_MSAL_CLIENT_ID is set in .env */
export const isMsalConfigured = clientId.length > 0;

const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const CALENDAR_SCOPES = ['Calendars.Read', 'User.Read', 'offline_access'];

export async function msalSignIn(): Promise<AccountInfo | null> {
  try {
    const result = await msalInstance.loginPopup({ scopes: CALENDAR_SCOPES });
    return result.account;
  } catch {
    return null;
  }
}

export async function msalSignOut(): Promise<void> {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) return;
  await msalInstance.logoutPopup({ account });
}

export async function getAccessToken(): Promise<string | null> {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) return null;
  try {
    const result = await msalInstance.acquireTokenSilent({
      scopes: CALENDAR_SCOPES,
      account,
    });
    return result.accessToken;
  } catch {
    // Silent refresh failed → ask user to log in again via popup
    try {
      const result = await msalInstance.acquireTokenPopup({ scopes: CALENDAR_SCOPES });
      return result.accessToken;
    } catch {
      return null;
    }
  }
}

export function getMsalAccount(): AccountInfo | null {
  return msalInstance.getAllAccounts()[0] ?? null;
}
