

## Plan: Add Ahrefs Web Analytics Script

The screenshot shows the Ahrefs Web Analytics installation page with the tracking snippet to add.

### Changes

**1. Edit `index.html`**
- Add the Ahrefs analytics script to the `<head>` section:
  ```html
  <script src="https://analytics.ahrefs.com/analytics.js" data-key="VouNMjijNalPNS/dBxC7Fw" async></script>
  ```

**2. Update CSP in `index.html` and `vite.config.ts`**
- Add `https://analytics.ahrefs.com` to `script-src` and `connect-src` directives so the tracker can load and send data.

### Scope
- 2 files modified (`index.html`, `vite.config.ts`)

