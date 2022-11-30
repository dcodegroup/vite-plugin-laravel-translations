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

## Usage in Vue 3.x.x
For more information on usage with <b>vue-i18n</b> refer to <a href="https://vue-i18n.intlify.dev/guide/#javascript">https://vue-i18n.intlify.dev/guide/#javascript</a>.

```js
// app.js
// 1. Create i18n instance with options
const i18n = VueI18n.createI18n({
  locale: 'ja', // set locale
  fallbackLocale: 'en', // set fallback locale
  LARAVEL_TRANSLATIONS, // set locale messages
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
  LARAVEL_TRANSLATIONS
});

...
new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
...
```

## Usage in JavaScript/NodeJS
```js
const translations = LARAVEL_TRANSLATIONS;
console.log(translations);
...
```


## Hot-Module Replacement (HMR)

When running `vite` with dev server running, any changes on any detected `lang/` folder for `.{php,json}` files will restart `vite` dev server so that the language configurations can be updated.

