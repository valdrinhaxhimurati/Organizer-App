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

export const CALENDAR_SCOPES = ['Calendars.Read', 'User.Read', 'offline_access'];

let msalInstance: PublicClientApplication | null = null;
let initializePromise: Promise<PublicClientApplication | null> | null = null;

async function ensureMsalInitialized(): Promise<PublicClientApplication | null> {
  if (!isMsalConfigured) {
    return null;
  }

  if (msalInstance) {
    return msalInstance;
  }

  if (!initializePromise) {
    initializePromise = (async () => {
      const instance = new PublicClientApplication(msalConfig);
      await instance.initialize();
      msalInstance = instance;
      return instance;
    })();
  }

  return initializePromise;
}

export async function msalSignIn(): Promise<AccountInfo | null> {
  const instance = await ensureMsalInitialized();
  if (!instance) return null;

  try {
    const result = await instance.loginPopup({ scopes: CALENDAR_SCOPES });
    return result.account;
  } catch {
    return null;
  }
}

export async function msalSignOut(): Promise<void> {
  const instance = await ensureMsalInitialized();
  if (!instance) return;

  const account = instance.getAllAccounts()[0];
  if (!account) return;
  await instance.logoutPopup({ account });
}

export async function getAccessToken(): Promise<string | null> {
  const instance = await ensureMsalInitialized();
  if (!instance) return null;

  const account = instance.getAllAccounts()[0];
  if (!account) return null;
  try {
    const result = await instance.acquireTokenSilent({
      scopes: CALENDAR_SCOPES,
      account,
    });
    return result.accessToken;
  } catch {
    // Silent refresh failed → ask user to log in again via popup
    try {
      const result = await instance.acquireTokenPopup({ scopes: CALENDAR_SCOPES });
      return result.accessToken;
    } catch {
      return null;
    }
  }
}

export async function getMsalAccount(): Promise<AccountInfo | null> {
  const instance = await ensureMsalInitialized();
  return instance?.getAllAccounts()[0] ?? null;
}
