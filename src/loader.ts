/**
 * ##########################################
 * #                 IMPORTS                #
 * ##########################################
 */
import { globSync } from 'glob';
import path from 'path';
// @ts-ignore - No types from JS package
import phpArrayReader from 'php-array-reader';
import { TranslationConfiguration } from '../types/index.js';

/**
 *    Function: buildTranslations()
 *    Description: Main function that fetches all of the Laravel translations
 *        and creates appropiate nested objects for.
 *
 *    @param absLangPath - The absolute path to Laravel lang/ directory
 *    @param pluginConfiguration - Plugin configurations
 *    @returns translations - Object/JSON version of Laravel Translations
 */
export const buildTranslations = async (absLangPath: string, pluginConfiguration: TranslationConfiguration) => {
  // # Define: Translation Object
  let translations = {};

  // # Define: Glob Regex
  const globRegex = pluginConfiguration.includeJson ? '**/*.{json,php}' : '**/*.php';

  // # Recursively: Fetch filenames as an array
  const files = globSync(path.join(absLangPath, globRegex), { windowsPathsNoEscape: true });

  // # Loop: Through each of the files and create object
  for (const file of files) {
    // # Define: File information
    const fileRaw = file.replace(absLangPath + path.sep, '');
    const fileExt = path.extname(fileRaw);
    const pathSplit = fileRaw.replace(fileExt, '').split(path.sep);

    // # Import/Parse: The .PHP/.JSON language file.
    // # Pre-Define: Initial Value for reducer
    const all = fileExt == '.php' ? phpArrayReader.fromFile(file) : await import(file);

    // # Configure: Namespaces
    if (typeof pluginConfiguration.namespace == 'string' && pluginConfiguration.namespace.length > 0) {
      // # Append configured namespace
      pathSplit.splice(1, 0, pluginConfiguration.namespace);
    }

    // # Generate: Nested Object from array
    const currentTranslationStructure = pathSplit.reverse().reduce((all, item) => ({ [item]: all }), all);

    // # Merge-Deep: Existing translations with current translations
    translations = mergeDeep(translations, currentTranslationStructure);
  }

  // # Return: Imported Laravel translations as JSON
  return translations;
};

/**
 *    Function: mergeDeep()
 *    Description: Method used to deeply merge objects that are nested.
 *
 *    @param target - Main Object to merge into
 *    @param source - Object 2 containing data to merge into main object
 *    @returns target
 */
// @ts-ignore - Unknown object definitions
const mergeDeep = (target, source) => {
  // @ts-ignore - Unknown object definitions
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
};
