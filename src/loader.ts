// @ts-ignore - No types from JS package
import phpArrayReader from 'php-array-reader';
import { globSync } from 'glob';
import path from 'path';
import { TranslationConfiguration } from '../types';
import { mergeDeep } from './utils/mergeDeep';

/**
 * Get the glob pattern based on the configuration
 *
 * @param shouldIncludeJson - Should include JSON files
 * @returns string - The glob pattern
 */
const globPattern = (shouldIncludeJson: boolean): string => (shouldIncludeJson ? '**/*.{json,php}' : '**/*.php');

/**
 * Configure the namespace for the path split
 *
 * @param pathSplit - The path split
 * @param namespace - The namespace
 * @returns string[] - The path split with the namespace
 */
const configureNamespaceIfNeeded = (pathSplit: string[], namespace: string): string[] => {
  if (namespace && namespace.length > 0) {
    // Append configured namespace
    pathSplit.splice(1, 0, namespace);
  }
  return pathSplit;
};

/**
 * Get the translation content by file extension
 *
 * @param fileExtension - The file extension
 * @param file - The file path
 * @returns Promise<any> - The translation content
 */
const translationContentByFileExtension = async (fileExtension: string, file: string): Promise<string> => {
  if (fileExtension === '.php') {
    return phpArrayReader.fromFile(file);
  }

  const fullPath = `${process.cwd()}/${file}`;
  return await import(fullPath);
};

/**
 * Generate the nested object structure
 *
 * @param pathSplit - The path split
 * @param all - The all object
 * @returns - The nested object structure
 */
const generateNestedObjectStructure = (pathSplit: string[], all: any): object =>
  pathSplit.reverse().reduce((all, item) => ({ [item]: all }), all);

/**
 *    Function: buildTranslations()
 *    Description: Main function that fetches all of the Laravel translations
 *        and creates appropiate nested objects for.
 *
 *    @param absLangPath - The absolute path to Laravel lang/ directory
 *    @param pluginConfiguration - Plugin configurations
 *    @returns translations - Object/JSON version of Laravel Translations
 */
export const buildTranslations = async (
  absLangPath: string,
  pluginConfiguration: TranslationConfiguration
): Promise<object> => {
  // Define the language directory
  const langDir = pluginConfiguration.absoluteLanguageDirectory || absLangPath;

  // Define the glob pattern
  const globRegex = globPattern(pluginConfiguration.includeJson || false);

  // Fetch filenames as an array
  const files = globSync(path.join(langDir, globRegex), { windowsPathsNoEscape: true });

  // Define initial translations
  const initialTranslations = Promise.resolve({});

  // Create translations object
  const translations = await files.reduce(async (accumulator, file) => {
    const { sep: pathSeparator } = path;

    // Wait for the accumulator to resolve
    const translations = await accumulator;

    // Extract the file path
    const fileRaw = file.replace(langDir + pathSeparator, '');

    // Extract the file extension
    const fileExtension = path.extname(fileRaw);

    // Extract the path split
    const pathSplit = fileRaw.replace(fileExtension, '').split(pathSeparator);

    const translationContent = await translationContentByFileExtension(fileExtension, file);
    const namespacePath = configureNamespaceIfNeeded(pathSplit, pluginConfiguration.namespace || '');
    const currentTranslationStructure = generateNestedObjectStructure(namespacePath, translationContent);

    return mergeDeep(translations, currentTranslationStructure);
  }, initialTranslations);

  return translations;
};
