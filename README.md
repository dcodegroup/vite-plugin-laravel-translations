<h1 align="center" style="border:none !important">
    Vite Plugin - Laravel Translations
</h1>

<br/>

<a href="https://www.npmjs.com/package/vite-plugin-laravel-translations">![npm](https://img.shields.io/npm/v/vite-plugin-laravel-translations)</a>
![Last Commit](https://img.shields.io/github/last-commit/dcodegroup/vite-plugin-laravel-translations)
![npm Total Downloads](https://img.shields.io/npm/dt/vite-plugin-laravel-translations)
<a href="https://snyk.io/advisor/npm-package/vite-plugin-laravel-translations">![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/dcodegroup/vite-plugin-laravel-translations)</a>
<a href="https://github.com/dcodegroup/vite-plugin-laravel-translations/issues">![Issues](https://img.shields.io/github/issues/dcodegroup/vite-plugin-laravel-translations)</a>
![npm peer dependency version](https://img.shields.io/npm/dependency-version/vite-plugin-laravel-translations/peer/vite)

<br/>

<p align="center">
    <b>vite-plugin-laravel-translations</b> is a <b>Vite</b> plugin that retrieves <b>Laravel</b> Framework translation
    files and makes them available as a global variable for use with any other <b>i18n</b> framework plugin such as <a href="https://www.npmjs.com/package/vue-i18n">vue-i18n</a> for <b>Vue</b> or <a href="https://www.npmjs.com/package/react-i18next">react-i18next</a> for <b>React</b>.
</p>

<p align="center">
    <b>NOTE:</b> This plugin uses Vite specific hooks (<a href="https://vitejs.dev/guide/api-plugin.html#config">config</a> & <a href="https://vitejs.dev/guide/api-plugin.html#handlehotupdate">handleHotUpdate</a>) to make the translations globally available and cannot be used as a rollup plugin.
</p>

## Installation

With [pnpm](https://pnpm.io):
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
			// # Declare: namespace (string|false)
			namespace: false,
		}),
	],
});
```

## Usage in Vue 3.x.x
For more information on usage with <b>vue-i18n</b> refer to <a href="https://vue-i18n.intlify.dev/guide/#javascript">https://vue-i18n.intlify.dev/guide/#javascript</a>.

```js
// app.js
// 1. Create i18n instance with options
const i18n = VueI18n.createI18n({
  locale: 'ja', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: LARAVEL_TRANSLATIONS, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})


// 2. Create a vue root instance
const app = Vue.createApp({
  // set something options
  // ...
})

// 3. Install i18n instance to make the whole app i18n-aware
app.use(i18n)

// 4. Mount
app.mount('#app')

// Now the app has started!
...
```

## Usage in Vue 2.x.x
```js
// app.js
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

Vue.config.productionTip = false;

var i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en-gb',
  messages: LARAVEL_TRANSLATIONS
});

...
new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
...
```

## Usage in React
This example uses `i18nnext` and `react-i18next` packages. Refer to <a href="https://dev.to/adrai/how-to-properly-internationalize-a-react-application-using-i18next-3hdb#getting-started">https://dev.to/adrai/how-to-properly-internationalize-a-react-application-using-i18next-3hdb#getting-started</a> for extended example.


### <b>Vite Config</b>
```js
import laravelTranslations from 'vite-plugin-laravel-translations';

export default defineConfig({
	...
	plugins: [
		laravelTranslations({
			// # Declare: namespace
			namespace: 'translation',
		}),
	],
});
```

### <b>Javascript</b>
```js
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: LARAVEL_TRANSLATIONS
  });

export default i18n;


// index.js (React >= 18.0.0)
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import './i18n';

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Usage in JavaScript/NodeJS
```js
const translations = LARAVEL_TRANSLATIONS;
console.log(translations);
...
```

## Custom language directory

By default, the plugin will look for language files in the `resources/lang` directory if the laravel version is minor than v9, otherwise it will look for language files in the `lang` directory. You can specify a custom directory by passing the `absoluteLanguageDirectory` option to the plugin.

```js
...
plugins: [
    laravelTranslations({
        absoluteLanguageDirectory: 'custom/path/to/lang',
    }),
],
```


## Hot-Module Replacement (HMR)

When running `vite` with dev server running, any changes on any detected `lang/` folder for `.{php,json}` files will restart `vite` dev server so that the language configurations can be updated.


## Known Issues/Caveats

As the `LARAVEL_TRANSLATIONS` variable is globally available and read by Vite, if it's wrapped into a string it will cause issues on build. <b><i>DON'T DO:</i></b> `"LARAVEL_TRANSLATIONS"` or `'LARAVEL_TRANSLATIONS'`
<br/><br/>E.g. `console.log("LARAVEL_TRANSLATIONS")`