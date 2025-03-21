"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTranslations = exports.replaceInterpolation = exports.generateNestedObjectStructure = exports.translationContentByFileExtension = exports.configureNamespaceIfNeeded = exports.globPattern = void 0;
// @ts-ignore - No types from JS package
const php_array_reader_1 = require("php-array-reader");
const glob_1 = require("glob");
const path_1 = __importDefault(require("path"));
const node_fs_1 = require("node:fs");
const mergeDeep_1 = require("./utils/mergeDeep");
/**
 * Get the glob pattern based on the configuration
 *
 * @param shouldIncludeJson - Should include JSON files
 * @returns string - The glob pattern
 */
const globPattern = (shouldIncludeJson) => (shouldIncludeJson ? '**/*.{json,php}' : '**/*.php');
exports.globPattern = globPattern;
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
exports.configureNamespaceIfNeeded = configureNamespaceIfNeeded;
/**
 * Get the translation content by file extension
 *
 * @param fileExtension - The file extension
 * @param file - The file path
 * @returns Promise<any> - The translation content
 */
const translationContentByFileExtension = async (fileExtension, file) => {
    if (fileExtension === '.php') {
        return (0, php_array_reader_1.fromString)((0, node_fs_1.readFileSync)(file, 'utf8'));
    }
    const fullPath = `${process.cwd()}/${file}`;
    return await Promise.resolve(`${fullPath}`).then(s => __importStar(require(s)));
};
exports.translationContentByFileExtension = translationContentByFileExtension;
/**
 * Generate the nested object structure
 *
 * @param pathSplit - The path split
 * @param all - The all object
 * @returns - The nested object structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateNestedObjectStructure = (pathSplit, all) => pathSplit.reverse().reduce((all, item) => ({ [item]: all }), all);
exports.generateNestedObjectStructure = generateNestedObjectStructure;
/**
 * Replace the interpolation with provided prefix and suffix
 *
 * @param object - The object structure
 * @param interpolation - An object with prefix and suffix to be used by interpolation
 * @returns - The object structure with the new interpolation
 */
const replaceInterpolation = (object, interpolation) => {
    let objectAsString = JSON.stringify(object);
    objectAsString = objectAsString.replace(/\:(\w+)/g, `${interpolation.prefix}$1${interpolation.suffix}`);
    return JSON.parse(objectAsString);
};
exports.replaceInterpolation = replaceInterpolation;
/**
 *    Function: buildTranslations()
 *    Description: Main function that fetches all of the Laravel translations
 *        and creates appropiate nested objects for.
 *
 *    @param absLangPath - The absolute path to Laravel lang/ directory
 *    @param pluginConfiguration - Plugin configurations
 *    @returns translations - Object/JSON version of Laravel Translations
 */
const buildTranslations = async (absLangPath, pluginConfiguration) => {
    // Define the language directory
    const langDir = pluginConfiguration.absoluteLanguageDirectory || absLangPath;
    // Define the glob pattern
    const globRegex = (0, exports.globPattern)(pluginConfiguration.includeJson || false);
    // Fetch filenames as an array
    const files = (0, glob_1.globSync)(path_1.default.join(langDir, globRegex), { windowsPathsNoEscape: true });
    // Define initial translations
    const initialTranslations = Promise.resolve({});
    // Create translations object
    const translations = await files.reduce(async (accumulator, file) => {
        const { sep: pathSeparator } = path_1.default;
        // Wait for the accumulator to resolve
        const translations = await accumulator;
        // Extract the file path
        const fileRaw = file.replace(langDir + pathSeparator, '');
        // Extract the file extension
        const fileExtension = path_1.default.extname(fileRaw);
        // Extract the path split
        const pathSplit = fileRaw.replace(fileExtension, '').split(pathSeparator);
        let translationContent = await (0, exports.translationContentByFileExtension)(fileExtension, file);
        if (pluginConfiguration.interpolation?.prefix && pluginConfiguration.interpolation?.suffix) {
            translationContent = (0, exports.replaceInterpolation)(translationContent, pluginConfiguration.interpolation);
        }
        const namespacePath = (0, exports.configureNamespaceIfNeeded)(pathSplit, pluginConfiguration.namespace || '');
        const currentTranslationStructure = (0, exports.generateNestedObjectStructure)(namespacePath, translationContent);
        return (0, mergeDeep_1.mergeDeep)(translations, currentTranslationStructure);
    }, initialTranslations);
    return translations;
};
exports.buildTranslations = buildTranslations;
