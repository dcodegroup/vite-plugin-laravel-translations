/**
 * ------------------------------------------------
 *  # Import: Dependencies
 * ------------------------------------------------
 */
import { readFileSync } from "node:fs";
import { globSync } from "glob";
import { join, extname, sep } from "node:path";
import { fromString } from "php-array-reader";
import { mergeDeep } from "./utils/mergeDeep";
import { TranslationConfiguration, InterpolationConfiguration, TranslationContentInterpolable } from "../types/index";

/**
 * Get the glob pattern based on the configuration
 *
 * @param shouldIncludeJson - Should include JSON files
 * @returns string - The glob pattern
 */
export const globPattern = (shouldIncludeJson: boolean): string => (shouldIncludeJson ? "**/*.{json,php}" : "**/*.php");

/**
 * Configure the namespace for the path split
 *
 * @param pathSplit - The path split
 * @param namespace - The namespace
 * @returns string[] - The path split with the namespace
 */
export const configureNamespaceIfNeeded = (pathSplit: string[], namespace?: string | null | false): string[] => {
  if (namespace && namespace.length > 0) {
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
export const translationContentByFileExtension = async (fileExtension: string, file: string, assertJsonImport?: boolean | undefined): Promise<string> => {
  if (fileExtension === ".php") {
    return fromString(readFileSync(file, "utf8"));
  }

  const fullPath = `${process.cwd()}/${file}`;

  // When using `pnpm` as package manager or we don't have the `.{mjs,mts}` extension in the vite config file
  // the import statement does not work as expected and the `import` function does not have the `with` property
  const { default: translations } = await import(fullPath, { ...(assertJsonImport && { with: { type: "json" } }) });
  return translations;
};

/**
 * Generate the nested object structure
 *
 * @param pathSplit - The path split
 * @param all - The all object
 * @returns - The nested object structure
 */
export const generateNestedObjectStructure = (pathSplit: string[], all: any): object => pathSplit.reverse().reduce((all, item) => ({ [item]: all }), all);

/**
 * Replace the interpolation with provided prefix and suffix
 *
 * @param object - The object structure
 * @param interpolation - An object with prefix and suffix to be used by interpolation
 * @returns - The object structure with the new interpolation
 */
export const replaceInterpolation = (object: unknown, interpolation: InterpolationConfiguration): string => {
  const interpolatedContent = `${interpolation.prefix}$1${interpolation.suffix}`;
  const objectAsString = JSON.stringify(object).replace(/:(\w+)/g, interpolatedContent);
  return JSON.parse(objectAsString);
};

/**
 * Fetches and builds the translations from the Laravel lang/ directory
 *
 * @param absLangPath - The absolute path to Laravel lang/ directory
 * @param pluginConfiguration - Plugin configurations
 * @returns translations - Object/JSON version of Laravel Translations
 */
export const buildTranslations = async (absLangPath: string, pluginConfiguration: TranslationConfiguration): Promise<object> => {
  // Define the language directory
  const langDir = pluginConfiguration.absoluteLanguageDirectory || absLangPath;

  // Define the glob pattern
  const globRegex = globPattern(pluginConfiguration.includeJson || false);

  // Fetch filenames as an array
  const files = globSync(join(langDir, globRegex));

  // Define initial translations
  const initialTranslations = Promise.resolve({});

  // Create translations object
  const translations = await files.reduce(async (accumulator, file) => {
    const pathSeparator = sep;

    // Wait for the accumulator to resolve
    const translations = await accumulator;

    // Extract the file path
    const fileRaw = file.replace(langDir + pathSeparator, "");

    // Extract the file extension
    const fileExtension = extname(fileRaw);

    // Extract the path split
    const pathSplit = fileRaw.replace(fileExtension, "").split(pathSeparator);

    // Build the translation content
    const translationContent = await buildContentInterpolation({
      file,
      fileExtension,
      pluginConfiguration,
    });
    const namespacePath = configureNamespaceIfNeeded(pathSplit, pluginConfiguration.namespace);
    const currentTranslationStructure = generateNestedObjectStructure(namespacePath, translationContent);

    return mergeDeep(translations, currentTranslationStructure);
  }, initialTranslations);

  return translations;
};

/**
 * Adds interpolation to the translation content
 *
 * @param file - The translation file
 * @param fileExtension - The translation file type/ext
 * @param pluginConfiguation - Extension configuration settings
 * @returns object - The translation content with interpolation
 */
const buildContentInterpolation = async ({ file, fileExtension, pluginConfiguration }: TranslationContentInterpolable): Promise<string> => {
  // # Fetch: Translation content
  const translationContent = await translationContentByFileExtension(fileExtension, file, pluginConfiguration.assertJsonImport);

  return pluginConfiguration.interpolation?.prefix && pluginConfiguration.interpolation?.suffix
    ? replaceInterpolation(translationContent, pluginConfiguration.interpolation)
    : translationContent;
};
