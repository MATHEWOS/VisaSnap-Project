# VisaSnap App Store and Play Store Launch Plan

VisaSnap is ready as a PWA test deployment. For App Store and Play Store distribution, ship a native wrapper around the same local photo tool and keep production paused until the phone test passes.

## Current Test URL

- Test app: https://test--visasnap-photo-tool.netlify.app
- Privacy policy: https://test--visasnap-photo-tool.netlify.app/privacy
- Package name / bundle ID draft: `com.visasnap.phototool`

## Local Store Prep

Run these from the project folder:

```bash
npm run check
npm run store:prepare
```

`npm run store:prepare` copies the static PWA files into `www/`, which is the web bundle Capacitor will place inside the iOS and Android apps.

## Native Wrapper Setup

Install Capacitor when you are ready to create native projects:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android --save-dev
```

Create and open the native apps:

```bash
npx cap add ios
npx cap add android
npm run cap:sync
npx cap open ios
npx cap open android
```

For iOS, use a Mac with Xcode and an Apple Developer Program account. For Android, use Android Studio and a Google Play Console developer account.

## iOS Checklist

- Use bundle ID `com.visasnap.phototool` unless you want a different permanent ID.
- Set camera/photo library permission text in Xcode before archive:
  - `NSCameraUsageDescription`: `VisaSnap uses the camera so you can take a passport or e-visa photo.`
  - `NSPhotoLibraryUsageDescription`: `VisaSnap lets you choose a photo from your library for local passport photo cropping.`
  - `NSPhotoLibraryAddUsageDescription`: `VisaSnap saves the finished passport photo when you choose to download or save it.`
- Create App Store Connect app record.
- Upload screenshots for iPhone sizes.
- Set privacy policy URL.
- Complete privacy labels using `store/privacy-disclosures.md`.
- Submit first to TestFlight, then App Review.

## Android Checklist

- Use application ID `com.visasnap.phototool` unless you want a different permanent ID.
- Build a signed Android App Bundle (`.aab`) from Android Studio.
- Upload to Play Console internal testing first.
- Complete Data safety using `store/privacy-disclosures.md`.
- Complete Content rating questionnaire.
- Add store listing text from `store/play-store-listing.md`.
- Add screenshots for phone.
- Promote from internal testing to production when the phone photo test is approved.

## Release Rule

Do not deploy the main production Netlify URL or submit store production releases until the latest phone test confirms:

- Front camera photos are not mirrored after capture.
- Photos are not brightened, sharpened, filtered, or background-replaced.
- The app still opens offline after one online launch.
