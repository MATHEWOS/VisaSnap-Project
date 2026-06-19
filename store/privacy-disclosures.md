# Privacy Disclosures

Use this as the starting point for App Store Connect privacy labels and Google Play Data safety. Keep it aligned with the live privacy policy before submission.

## Current App Behavior

- Photos are processed locally on the device for cropping and download.
- The core photo tool does not upload selected photos to a VisaSnap server.
- Camera access is user-initiated through Take Photo.
- Photo library access is user-initiated through Upload.
- Offline cache stores app code and assets, not user photos.
- External government visa links open third-party websites with their own privacy practices.
- Monetization code is currently dormant unless Stripe, ads, or affiliate settings are enabled in `monetization.js`.

## Apple App Privacy Details Draft

If monetization remains off:

- Data collected: None by VisaSnap for the core app.
- Photos or Videos: Not collected, because selected photos stay on device and are not transmitted to VisaSnap.
- Tracking: No.
- Third-party advertising: No.

If ads, affiliate tracking, analytics, or paid upgrades are enabled later, update these answers before submission.

## Google Play Data Safety Draft

If monetization remains off:

- Does the app collect or share required user data? No, for VisaSnap's core app behavior.
- Is all user data encrypted in transit? Not applicable for core photo processing; external HTTPS links are opened outside the app flow.
- Can users request data deletion? No account or server-stored user data is created by the core app.
- Photos and videos: Accessed locally for app functionality, not collected or shared by VisaSnap.

If ads, affiliate tracking, analytics, or paid upgrades are enabled later, disclose the provider data collection and sharing in Play Console and in the privacy policy.

## Permission Copy

- Camera: `VisaSnap uses the camera so you can take a passport or e-visa photo.`
- Photos: `VisaSnap lets you choose a photo for local passport photo cropping.`
- Save photos: `VisaSnap saves the finished passport photo when you choose to download or save it.`

## Official References Checked

- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- Google Play Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
