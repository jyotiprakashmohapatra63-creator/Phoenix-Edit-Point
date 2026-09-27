# Branding: icon and logo

The starter logo is `logo.svg`; it appears at the top of the app. Replace it with your own logo using the same name (SVG, PNG, or JPG), then update the extension in `www/index.html` if needed.

For a Windows app icon, add `build/icon.ico` (recommended: 256 × 256 pixels inside the ICO). Electron Builder will use it automatically.

For an Android icon, add `resources/icon.png` at 1024 × 1024 pixels. After installing dependencies, run `npx @capacitor/assets generate --android` before building Android. The generated `android/` folder is intentionally ignored because it can be recreated.
