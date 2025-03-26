## Release v0.3.0 - Vite Env, Github Workflows & Updates

- Fixed issue with `mergeDeep` function when importing `.json` files using `pnpm`
- Updated project to use latest `NPM` packages
- Updated `eslint` and `prettier` configurations
- Updated package to use `vite` for `build` process
- Added new plugin variable `useGlobalVar` for backwards compatiblity
- Added `Github Actions` workflows for `CI/CD` pipeline builds
- Added `dependabot` configuration for staying updated
- Prepare for versioning with `semantic-release`

</br>

### Breaking Changes

- Switched `LARAVEL_TRANSLATIONS` to use `import.meta.env` as `VITE_LARAVEL_TRANSLATIONS`:

  ```js
  // app.js
  // 1. Create i18n instance with options
  const i18n = VueI18n.createI18n({
    locale: "ja", // set locale
    fallbackLocale: "en", // set fallback locale
    messages: import.meta.env.VITE_LARAVEL_TRANSLATIONS, // set locale messages
    // If you need to specify other options, you can set other options
    // ...
  });
  ```

  Please now use `import.meta.env.VITE_LARAVEL_TRANSLATIONS` instead of `LARAVEL_TRANSLATIONS` in your project or add the following to your `vite.config.ts`:

  ```js
  import laravelTranslations from 'vite-plugin-laravel-translations';

  export default defineConfig({
  	...
  	plugins: [
  		laravelTranslations({
  			// # Backwards compatibility for `LARAVEL_TRANSLATIONS`
  			useGlobalVar: true,
  		}),
  	],
  });
  ```
