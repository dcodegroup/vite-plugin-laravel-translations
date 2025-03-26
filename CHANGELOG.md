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
