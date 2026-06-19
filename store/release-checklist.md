# Release Checklist

## Before Native Builds

- `npm run check`
- `npm run store:prepare`
- Test on phone from https://test--visasnap-photo-tool.netlify.app
- Confirm production Netlify is still paused until approval.
- Confirm privacy policy URL is public.
- Decide final bundle ID/application ID before first upload.

## Phone Acceptance Test

- Take a front camera photo.
- Confirm the captured photo is not mirrored after capture.
- Confirm the photo is not brightened, sharpened, filtered, or background-replaced.
- Upload an existing photo from the library.
- Download/save the finished JPG.
- Turn on airplane mode after one online launch and confirm the photo tool opens.

## Store Assets Needed

- App icon: 1024 x 1024 PNG for App Store Connect.
- App icon: 512 x 512 PNG for Google Play.
- Feature graphic: 1024 x 500 PNG for Google Play.
- iPhone screenshots.
- Android phone screenshots.
- Support contact email.
- Final production website URL.
- Final privacy policy URL.

## Submission Order

1. Keep production paused while testing.
2. Build native iOS and Android wrappers.
3. Submit iOS to TestFlight.
4. Submit Android to Play internal testing.
5. Fix any store review issues.
6. Unpause production and update store URLs to production.
7. Promote store releases to public.
