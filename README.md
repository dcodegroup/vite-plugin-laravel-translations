<h1 align="center" style="border:none !important">
    Vite Plugin - Laravel Translations
</h1>

<p align="center">
    <b>vite-plugin-laravel-translations</b> is a <b>Vite</b> plugin that retrieves <b>Laravel</b> Framework translation
    files and makes them available as a global variable for use with any other <b>i18n</b> framework plugin such as <a href="https://www.npmjs.com/package/vue-i18n">vue-i18n</a> for <b>Vue</b>.
</p>

## Installation

With [pnpm](https://www.npmjs.com):
```sh
pnpm i vite-plugin-laravel-translations
```

with [npm](https://www.npmjs.com):
```sh
npm i vite-plugin-laravel-translations
```

or with [yarn](https://yarnpkg.com):
```sh
yarn add vite-plugin-laravel-translations
```

## Setup with Vite
```js
import laravelTranslations from 'vite-plugin-laravel-translations';

export default defineConfig({
	...
	plugins: [
		laravelTranslations({
			// # TBC: To include JSON files
			includeJson: false,
			// # TBC: Declare namespace (string|boolean)
			namespace: false,
		}),
	],
});
```

## Usage in JavaScript/NodeJS
This plugin will make the Laravel translations available as a global variable named `LARAVEL_TRANSLATIONS` and can be accessed like so.
```js
const translations = LARAVEL_TRANSLATIONS;
console.log(translations);
...
```


## Hot-Module Replacement (HMR)

When running `vite` with dev server running, any changes on any detected `lang/` folder for `.{php,json}` files will restart `vite` dev server so that the language configurations can be updated.

