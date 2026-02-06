

## Plan: Fix "Maximum update depth exceeded" infinite loop

### Root cause

The `LanguageRedirect` component in `src/App.tsx` (line 93) includes `i18n` in the `useEffect` dependency array. When `i18n.changeLanguage()` is called, `react-i18next` emits events that trigger React store re-renders, which cause `useEffect` to re-evaluate. Since the `i18n` object reference can appear changed after a language switch, this creates an infinite loop.

### Fix

**File: `src/App.tsx` (lines 83-93)**

Remove `i18n` from the dependency array. The effect only needs to react to URL path changes. The `i18n` instance is a stable singleton and does not need to be tracked as a dependency.

```tsx
useEffect(() => {
  let targetLang = 'es';
  if (location.pathname.startsWith('/ca/') || location.pathname === '/ca') {
    targetLang = 'ca';
  } else if (location.pathname.startsWith('/en/') || location.pathname === '/en') {
    targetLang = 'en';
  }
  if (i18n.language !== targetLang) {
    i18n.changeLanguage(targetLang);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [location.pathname]);
```

This is a one-line change (removing `i18n` from the dependency array and adding an eslint-disable comment). No other files need modification.

