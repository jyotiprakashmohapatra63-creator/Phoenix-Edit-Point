const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Clean modern Chrome User Agent so Google OAuth allows sign-in seamlessly inside Electron
const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
app.userAgentFallback = CHROME_USER_AGENT;

const LIVE_APP_URL = 'https://jyotiprakashmohapatra63-creator.github.io/Phoenix-Edit-Point-HTML/';

function createWindow() {
  const window = new BrowserWindow({
    width: 1220,
    height: 860,
    minWidth: 360,
    minHeight: 620,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.webContents.setUserAgent(CHROME_USER_AGENT);

  const loadApp = async () => {
    try {
      await window.loadURL(`${LIVE_APP_URL}?v=${Date.now()}`);
      return;
    } catch (error) {
      console.warn('Live app could not be loaded; using bundled copy instead.', error);
    }
    await window.loadFile(path.join(__dirname, 'www', 'index.html'));
  };

  loadApp();

  // Allow Google Auth and Firebase popup windows inside Electron
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (
      url === 'about:blank' ||
      url.includes('accounts.google.com') ||
      url.includes('firebaseapp.com') ||
      url.includes('google.com')
    ) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
          width: 520,
          height: 680,
          webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
          }
        }
      };
    }
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  window.webContents.on('did-create-window', (childWindow) => {
    childWindow.webContents.setUserAgent(CHROME_USER_AGENT);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
