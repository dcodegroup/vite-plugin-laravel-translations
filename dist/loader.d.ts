import { TranslationConfiguration } from '../types/index.js';
/**
 *    @function buildTranslations()
 *    @description Main function that fetches all of the Laravel translations
 *        and creates appropiate nested objects for.
 *
 *    @param absLangPath - The absolute path to Laravel lang/ directory
 *    @param pluginConfiguration - Plugin configurations
 *    @returns translations - Object/JSON version of Laravel Translations
 */
export declare const buildTranslations: (absLangPath: string, pluginConfiguration: TranslationConfiguration) => Promise<object>;
