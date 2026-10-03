# Phoenix Edit Point — Live HTML source

This is the **only repository you edit for normal app-code updates**.

The installed Phoenix Edit Point EXE/APK opens this GitHub Pages address whenever it starts:

`https://jyotiprakashmohapatra63-creator.github.io/Phoenix-Edit-Point-HTML/`

So after you edit and commit `index.html` here, GitHub automatically deploys the change. With internet connected, the next time the installed app opens it shows the new code. No new EXE/APK download is needed for normal HTML, CSS, JavaScript, logo, or app-config changes.

## Files to edit

- `index.html` — complete app page: HTML, CSS, JavaScript, Google Sheet logic.
- `app-config.js` — live refresh interval.
- `assets/branding/logo.svg` — in-app logo.
- `assets/branding/app-icon.svg` — web/PWA icon.

## One-time setup

After uploading this source package, go to **Settings → Pages** and select **GitHub Actions** under *Build and deployment*. The `Deploy Phoenix live app` action publishes the site.

Then update/build/install the Phoenix-Edit-Point EXE/APK **one last time**. Future source changes in this repository update automatically when the app opens online.

## Limits

Native-only changes—Android package name, Android permissions, app icon in the installed APK, Windows EXE icon, or Electron/Capacitor configuration—still require an intentional new EXE/APK build and installation. Normal page code does not.
