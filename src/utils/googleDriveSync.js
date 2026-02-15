/**
 * Google Drive sync utilities for BreadWinner.
 * 
 * Saves user data to their own Google Drive account for cross-device sync.
 * The developer never has access to user data - it stays in the user's Drive.
 */

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const FILE_NAME = 'breadwinner-data.json';

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Initialize the Google API client.
 * Call this on app startup with your Google Cloud credentials.
 */
export const initGoogleDrive = (clientId, apiKey, callback) => {
  // Load the Google API library
  const gapiScript = document.createElement('script');
  gapiScript.src = 'https://apis.google.com/js/api.js';
  gapiScript.onload = () => {
    window.gapi.load('client', async () => {
      await window.gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
      maybeEnableButtons(callback);
    });
  };
  document.body.appendChild(gapiScript);

  // Load the Google Identity Services library
  const gisScript = document.createElement('script');
  gisScript.src = 'https://accounts.google.com/gsi/client';
  gisScript.onload = () => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons(callback);
  };
  document.body.appendChild(gisScript);
};

function maybeEnableButtons(callback) {
  if (gapiInited && gisInited && callback) {
    callback();
  }
}

/**
 * Sign in to Google and request Drive access.
 * Returns a promise that resolves when signed in.
 */
export const signInToGoogle = () => {
  return new Promise((resolve, reject) => {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        reject(resp);
        return;
      }
      resolve(resp);
    };

    if (window.gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and consent
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser if already signed in
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
};

/**
 * Sign out from Google.
 */
export const signOutFromGoogle = () => {
  const token = window.gapi.client.getToken();
  if (token !== null) {
    window.google.accounts.oauth2.revoke(token.access_token);
    window.gapi.client.setToken('');
  }
};

/**
 * Check if user is currently signed in.
 */
export const isSignedIn = () => {
  return window.gapi?.client?.getToken() !== null;
};

/**
 * Get the signed-in user's email.
 */
export const getUserEmail = async () => {
  try {
    const token = window.gapi.client.getToken();
    if (!token) return null;
    
    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });
    const data = await response.json();
    return data.email;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
};

/**
 * Find the BreadWinner data file in the user's Google Drive.
 * Returns the file ID if found, null otherwise.
 */
const findDataFile = async () => {
  try {
    const response = await window.gapi.client.drive.files.list({
      q: `name='${FILE_NAME}' and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name)',
    });
    const files = response.result.files;
    return files.length > 0 ? files[0].id : null;
  } catch (error) {
    console.error('Error finding file:', error);
    return null;
  }
};

/**
 * Save data to Google Drive.
 * Creates a new file or updates existing one.
 */
export const saveToGoogleDrive = async (data) => {
  try {
    const fileId = await findDataFile();
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    
    const metadata = {
      name: FILE_NAME,
      mimeType: 'application/json',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const token = window.gapi.client.getToken();
    
    let response;
    if (fileId) {
      // Update existing file
      response = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token.access_token}` },
          body: form,
        }
      );
    } else {
      // Create new file
      response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token.access_token}` },
          body: form,
        }
      );
    }

    if (!response.ok) {
      throw new Error('Failed to save to Google Drive');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving to Google Drive:', error);
    throw error;
  }
};

/**
 * Load data from Google Drive.
 * Returns null if no file exists yet.
 */
export const loadFromGoogleDrive = async () => {
  try {
    const fileId = await findDataFile();
    if (!fileId) {
      return null; // No file exists yet
    }

    const response = await window.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media',
    });

    return response.result;
  } catch (error) {
    console.error('Error loading from Google Drive:', error);
    throw error;
  }
};

/**
 * Delete the data file from Google Drive.
 * Useful for "sign out and clear cloud data" feature.
 */
export const deleteFromGoogleDrive = async () => {
  try {
    const fileId = await findDataFile();
    if (!fileId) {
      return; // No file to delete
    }

    await window.gapi.client.drive.files.delete({
      fileId: fileId,
    });
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw error;
  }
};
