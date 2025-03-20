// @ts-ignore - No types from JS package
import { fromString } from 'php-array-reader';
import { globSync } from 'glob';
import path from 'path';
import { mergeDeep } from './utils/mergeDeep.js';
import { readFileSync } from 'node:fs';
/**
 * Get the glob pattern based on the configuration
 *
 * @param shouldIncludeJson - Should include JSON files
 * @returns string - The glob pattern
 */
const globPattern = (shouldIncludeJson) => (shouldIncludeJson ? '**/*.{json,php}' : '**/*.php');
/**
 * Configure the namespace for the path split
 *
 * @param pathSplit - The path split
 * @param namespace - The namespace
 * @returns string[] - The path split with the namespace
 */
const configureNamespaceIfNeeded = (pathSplit, namespace) => {
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
const translationContentByFileExtension = async (fileExtension, file, assertJsonImport) => {
    if (fileExtension === '.php') {
        return fromString(readFileSync(file, 'utf8'));
    }
    const fullPath = `${process.cwd()}/${file}`;
    // When using `pnpm` as package manager or we don't have the `.{mjs,mts}` extension in the vite config file
    // the import statement does not work as expected and the `import` function does not have the `with` property
    const { default: translations } = await import(fullPath, { ...(assertJsonImport && { with: { type: 'json' } }) });
    return translations;
};
/**
 * Generate the nested object structure
 *
 * @param pathSplit - The path split
 * @param all - The all object
 * @returns - The nested object structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateNestedObjectStructure = (pathSplit, all) => pathSplit.reverse().reduce((all, item) => ({ [item]: all }), all);
/**
 * Replace the interpolation with provided prefix and suffix
 *
 * @param object - The object structure
 * @param interpolation - An object with prefix and suffix to be used by interpolation
 * @returns - The object structure with the new interpolation
 */
const replaceInterpolation = (object, interpolation) => {
    const interpolatedContent = `${interpolation.prefix}$1${interpolation.suffix}`;
    const objectAsString = JSON.stringify(object).replace(/:(\w+)/g, interpolatedContent);
    return JSON.parse(objectAsString);
};
/**
 *    @function buildTranslations()
 *    @description Main function that fetches all of the Laravel translations
 *        and creates appropiate nested objects for.
 *
 *    @param absLangPath - The absolute path to Laravel lang/ directory
 *    @param pluginConfiguration - Plugin configurations
 *    @returns translations - Object/JSON version of Laravel Translations
 */
export const buildTranslations = async (absLangPath, pluginConfiguration) => {
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
        // Build the translation content
        const translationContent = await buildContentInterpolation({
            file,
            fileExtension,
            pluginConfiguration
        });
        const namespacePath = configureNamespaceIfNeeded(pathSplit, pluginConfiguration.namespace);
        const currentTranslationStructure = generateNestedObjectStructure(namespacePath, translationContent);
        return mergeDeep(translations, currentTranslationStructure);
    }, initialTranslations);
    return translations;
};
const buildContentInterpolation = async ({ file, fileExtension, pluginConfiguration }) => {
    var _a, _b;
    // Fetch the translation content
    const translationContent = await translationContentByFileExtension(fileExtension, file, pluginConfiguration.assertJsonImport);
    // Check if the interpolation is configured
    if (((_a = pluginConfiguration.interpolation) === null || _a === void 0 ? void 0 : _a.prefix) && ((_b = pluginConfiguration.interpolation) === null || _b === void 0 ? void 0 : _b.suffix)) {
        return replaceInterpolation(translationContent, pluginConfiguration.interpolation);
    }
    return translationContent;
};
//# sourceMappingURL=loader.js.map