const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

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
      sandbox: true,
      partition: 'persist:phoenix_session',
      devTools: false
    }
  });

  window.webContents.setUserAgent(CHROME_USER_AGENT);

  // Hard block DevTools from ever opening in the desktop app
  window.webContents.on('devtools-opened', () => {
    window.webContents.closeDevTools();
  });

  window.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && (input.key.toLowerCase() === 'i' || input.key.toLowerCase() === 'j' || input.key.toLowerCase() === 'c'))) {
      event.preventDefault();
    }
  });

  window.webContents.on('did-finish-load', () => {
    window.webContents.executeJavaScript('window.IS_PHOENIX_DESKTOP = true;').catch(() => {});
  });

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

  // Google & Firebase Auth popups open directly inside Electron window so session is persisted
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('accounts.google.com') || url.includes('firebaseapp.com')) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 500,
          height: 650,
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
          }
        }
      };
    }
    if (/^https?:/i.test(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
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

