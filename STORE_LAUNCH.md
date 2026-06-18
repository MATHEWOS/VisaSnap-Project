# VisaSnap iOS and Android Launch Plan

## Phase 1: Publish the PWA

Publish this folder as a static HTTPS site. Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any HTTPS static host will work.

Required production checks:

- `https://your-domain.example/manifest.webmanifest` returns JSON.
- `https://your-domain.example/sw.js` is not aggressively cached.
- `https://your-domain.example/privacy.html` is public.
- Android Chrome can install the app from the browser.
- iPhone Safari can add the app with Share > Add to Home Screen.
- Airplane mode still opens the photo tool after one online load.

## Phase 2: Android Play Store

Recommended Android path: Trusted Web Activity.

You will need:

- Published HTTPS URL.
- Google Play Console developer account.
- App package name, for example `com.visasnap.app`.
- Android signing key.
- A Digital Asset Links file at `/.well-known/assetlinks.json` after the Android signing certificate fingerprint is known.

Typical Bubblewrap flow after the PWA is live:

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-domain.example/manifest.webmanifest
bubblewrap build
```

Then upload the generated Android App Bundle to Google Play Console.

## Phase 3: iOS App Store

There is no Apple App Store submission for a plain PWA. For App Store distribution, wrap the web app with Capacitor and submit from Xcode.

You will need:

- A Mac with Xcode.
- Apple Developer Program account.
- Bundle identifier, for example `com.visasnap.app`.
- App Store Connect listing, screenshots, support URL, and privacy policy URL.

Typical Capacitor setup:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init VisaSnap com.visasnap.app --web-dir .
npx cap add ios
npx cap add android
npx cap open ios
```

For Android with Capacitor instead of TWA:

```bash
npx cap open android
```

## Store Listing Draft

Name: VisaSnap

Short description: Create passport and e-visa photos from your phone.

Full description:
VisaSnap helps travelers create passport-style and e-visa photos on their device. Take or upload a photo, crop it into common visa sizes, choose a compliant background, and download a JPG for use with official visa portals. The core photo tool works offline after the first load.

Privacy summary:
VisaSnap processes selected photos locally on the device. The core photo tool does not upload images to a server. External visa links open third-party government websites with their own policies.

Categories:
Travel, Utilities, Photo.
