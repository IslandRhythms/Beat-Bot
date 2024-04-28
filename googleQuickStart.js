const fs = require('fs').promises;
const { createReadStream } = require('fs');
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  console.log('what is client', client);
  if (client) {
    return client;
  }
  console.log('what is credentials path', CREDENTIALS_PATH)
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
  await uploadFiles(authClient);
}
// works!
async function uploadFiles(authClient) {


  const drive = google.drive({
    version: 'v3',
    auth: authClient
  });

  const filePath = path.join(__dirname, 'tableTopCharacterInformation.html');

  const res = await drive.files.create({
    requestBody: {
      name: 'Test4',
      mimeType: 'text/html'
    },
    media: {
      mimeType: 'text/html',
      body: createReadStream(filePath)
    }
  })
  console.log('what is res', res, res.data);
  const fileData = res.data;

  await drive.permissions.create({
    fileId: fileData.id,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  });

  const result = await drive.files.get({
    fileId: fileData.id,
    fields: 'webViewLink, webContentLink' // content downloads, view views
  });
  console.log(result.data);
}

authorize().then(listFiles).catch(console.error);