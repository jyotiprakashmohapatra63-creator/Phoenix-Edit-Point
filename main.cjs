const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');

const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
app.userAgentFallback = CHROME_USER_AGENT;

const LIVE_APP_URL = 'https://jyotiprakashmohapatra63-creator.github.io/Phoenix-Edit-Point-HTML/';
const AUTH_LOOPBACK_PORT = 54321;
let authServer = null;

function startAuthLoopbackServer(mainWindow) {
  if (authServer) return;
  authServer = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Private-Network': 'true'
      });
      res.end();
      return;
    }

    try {
      const reqUrl = new URL(req.url, `http://localhost:${AUTH_LOOPBACK_PORT}`);
      if (reqUrl.pathname === '/auth-callback') {
        const email = (reqUrl.searchParams.get('email') || '').toLowerCase().trim();
        
        if (email === 'jyotiprakashmohapatra63@gmail.com' || email === 'admin@phoenixeditpoint.com') {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.executeJavaScript(`
              try {
                if (typeof unlockAdminFromDesktopBridge === 'function') {
                  unlockAdminFromDesktopBridge(${JSON.stringify(email)});
                }
              } catch(e){}
            `).catch(err => console.error('Bridge JS error:', err));
            mainWindow.focus();
          }

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><title>Authentication Successful</title></head>
            <body style="font-family: Arial, sans-serif; background: #0b0f19; color: #38bdf8; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
              <div style="background: #111827; padding: 36px 40px; border-radius: 14px; border: 1px solid rgba(56, 189, 248, 0.4); text-align: center; max-width: 440px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                <div style="font-size: 42px; margin-bottom: 12px;">✅</div>
                <h2 style="color: #4ade80; margin: 0 0 10px 0;">Login Successful!</h2>
                <p style="color: #cbd5e1; font-size: 15px; margin: 0 0 16px 0;">Phoenix Edit Point Desktop App is now <b>Unlocked</b>.</p>
                <p style="color: #94a3b8; font-size: 13px; margin: 0;">You can safely close this browser window and return to the software.</p>
              </div>
              <script>setTimeout(() => { try { window.close(); } catch(e){} }, 2500);</script>
            </body>
            </html>
          `);
          return;
        }
      }
    } catch (e) {
      console.error('Auth request parsing failed:', e);
    }

    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid Auth Request');
  });

  authServer.listen(AUTH_LOOPBACK_PORT, '127.0.0.1', () => {
    console.log(`Auth loopback bridge active on http://127.0.0.1:${AUTH_LOOPBACK_PORT}`);
  });

  authServer.on('error', (err) => {
    console.warn('Auth server notice (port busy or in use):', err.message);
  });
}

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
      partition: 'persist:phoenix_session'
    }
  });

  window.webContents.setUserAgent(CHROME_USER_AGENT);

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
  startAuthLoopbackServer(window);

  // External URLs (OAuth / Chrome Browser) open directly in system browser (Google Chrome)
  window.webContents.setWindowOpenHandler(({ url }) => {
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
  if (authServer) {
    try { authServer.close(); } catch (e) {}
  }
  if (process.platform !== 'darwin') app.quit();
});
