# VisaSnap Deployment

VisaSnap is a static PWA. Publish the contents of this folder as the web root.

## Recommended hosts

- Netlify: drag this folder into a new site, or connect the repo and set publish directory to this folder.
- Vercel: import as a static project and set the output directory to this folder.
- GitHub Pages: publish this folder from the selected branch.
- Cloudflare Pages: connect the repo and set build command to none and output directory to this folder.

## Before store submission

- Replace the placeholder contact section in `privacy.html`.
- Publish `privacy.html` at the final HTTPS domain.
- Use the final HTTPS domain in Google Play and App Store Connect listings.
- For Android Trusted Web Activity, copy `.well-known/assetlinks.template.json` to `.well-known/assetlinks.json` after adding the real package name and signing certificate fingerprint.

## Requirements

- Use HTTPS in production. Service workers, camera capture, and installability depend on a secure origin.
- Keep `sw.js`, `manifest.webmanifest`, `index.html`, `app.js`, `styles.css`, and `icons/` at the same path level.
- Do not heavily cache `sw.js`; the included `_headers` file sets this for hosts that support it.
- After publishing, open the site once online before testing offline mode.

## Mobile QA

- Android Chrome: open the URL, confirm the Install button appears, install it, then launch from the home screen.
- iPhone Safari: open the URL, use Share, then Add to Home Screen, then launch from the home screen.
- Verify camera upload, gallery upload, crop controls, and JPG download.
- Enable airplane mode after one successful load and confirm the photo tool still opens.
