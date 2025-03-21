import { TranslationConfiguration, InterpolationConfiguration } from '../types';
/**
 * Get the glob pattern based on the configuration
 *
 * @param shouldIncludeJson - Should include JSON files
 * @returns string - The glob pattern
 */
export declare const globPattern: (shouldIncludeJson: boolean) => string;
/**
 * Configure the namespace for the path split
 *
 * @param pathSplit - The path split
 * @param namespace - The namespace
 * @returns string[] - The path split with the namespace
 */
export declare const configureNamespaceIfNeeded: (pathSplit: string[], namespace: string) => string[];
/**
 * Get the translation content by file extension
 *
 * @param fileExtension - The file extension
 * @param file - The file path
 * @returns Promise<any> - The translation content
 */
export declare const translationContentByFileExtension: (fileExtension: string, file: string) => Promise<string>;
/**
 * Generate the nested object structure
 *
 * @param pathSplit - The path split
 * @param all - The all object
 * @returns - The nested object structure
 */
export declare const generateNestedObjectStructure: (pathSplit: string[], all: any) => object;
/**
 * Replace the interpolation with provided prefix and suffix
 *
 * @param object - The object structure
 * @param interpolation - An object with prefix and suffix to be used by interpolation
 * @returns - The object structure with the new interpolation
 */
export declare const replaceInterpolation: (object: any, interpolation: InterpolationConfiguration) => any;
/**
 *    Function: buildTranslations()
 *    Description: Main function that fetches all of the Laravel translations
 *        and creates appropiate nested objects for.
 *
 *    @param absLangPath - The absolute path to Laravel lang/ directory
 *    @param pluginConfiguration - Plugin configurations
 *    @returns translations - Object/JSON version of Laravel Translations
 */
export declare const buildTranslations: (absLangPath: string, pluginConfiguration: TranslationConfiguration) => Promise<object>;
