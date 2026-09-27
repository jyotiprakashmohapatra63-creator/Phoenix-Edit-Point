# Phoenix Edit Point — Windows EXE + Android APK

This is your original Phoenix Edit Point HTML app, prepared as a responsive installable app project. It retains the existing Google Apps Script URL and live Google Sheets behaviour.

## What is included

- Responsive layout for phones, tablets, and computer screens.
- Existing Google Sheet data remains live; an open data view refreshes every 30 seconds.
- Data screens open full-screen and have no Print or Download controls.
- Desktop app build using Electron (Windows installer EXE and portable EXE).
- Android app build using Capacitor (APK).
- GitHub Actions workflow that builds both files when you push to `main` or `master`.
- GitHub Pages live mode: after one final EXE/APK installation, future code from `Phoenix-Edit-Point-HTML` loads automatically when the app opens.
- Starter logo and icon files that can be replaced later.

## Upload to GitHub and get the files

1. Create a new empty GitHub repository, then upload all files in this project (including the `.github` folder).
2. Push to the `main` branch. Open the repository's **Actions** tab and select **Build Phoenix Edit Point apps**.
3. When the run finishes, open it and download these artifacts:
   - `Phoenix-Edit-Point-Windows` contains the Windows installer EXE and portable EXE.
   - `Phoenix-Edit-Point-Android-APK` contains `app-debug.apk`, which can be installed on an Android phone after allowing installs from the browser/files app.

The APK is a debug build, suitable for direct testing and personal installation. For Play Store publishing, build a signed release/AAB with your own Android signing key; never upload a signing key to GitHub.

## Automatic code updates from Phoenix-Edit-Point-HTML

1. Upload the dedicated source package into the separate `Phoenix-Edit-Point-HTML` repository.
2. In `Phoenix-Edit-Point-HTML`, open **Settings → Pages** and choose **GitHub Actions** under *Build and deployment*.
3. Build and install the updated EXE/APK from this repository one final time.
4. Later, edit and commit only the source files in `Phoenix-Edit-Point-HTML`. GitHub Pages deploys those files, and the installed app loads them when it next opens—no new download or installation for normal web-code changes.

The live source URL is `https://jyotiprakashmohapatra63-creator.github.io/Phoenix-Edit-Point-HTML/`. The user needs an internet connection for updates. Android app icons, Android permissions, the app package name, and Electron/native features remain native changes, so they still require a new build and installation.

## Edit later

| What you want to change | File or action |
| --- | --- |
| App design, forms, buttons, Sheet logic | `Phoenix-Edit-Point-HTML/index.html` |
| Google Sheet refresh time | `Phoenix-Edit-Point-HTML/app-config.js` |
| Main logo | replace `Phoenix-Edit-Point-HTML/assets/branding/logo.svg` |
| Browser/PWA icon | replace `Phoenix-Edit-Point-HTML/assets/branding/app-icon.svg` |
| Windows app icon | add `build/icon.ico` |
| Android app icon | add `resources/icon.png`, then run `npm install` and `npm run android:icons` before the Android build |
| Android package name | `capacitor.config.json` and `package.json` (`appId`) — set it before publishing |

After normal page-code changes, push to `Phoenix-Edit-Point-HTML`; no new app artifact is needed. Live sheet rows likewise appear through the existing Google Apps Script connection when a user opens a data view.

## Build on your own computer (optional)

Install Node.js 22+ first. Android builds additionally need Android Studio and a JDK.

```powershell
npm install
npm run desktop:build
npx cap add android
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

Windows EXE files will be in `release`. The APK will be in `android\app\build\outputs\apk\debug\app-debug.apk`.

## Important security note

The sheet password in the supplied HTML is a browser-side password. A person with access to the app files can inspect it, so it is only a convenience lock—not protection for sensitive financial data. Real protection should be enforced in your Google Sheet / Apps Script permissions.
