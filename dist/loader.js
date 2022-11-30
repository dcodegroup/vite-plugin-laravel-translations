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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTranslations = void 0;
/**
 * ##########################################
 * #			     IMPORTS	 			#
 * ##########################################
 */
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
// @ts-ignore - No types from JS package
const php_array_reader_1 = __importDefault(require("php-array-reader"));
/**
 * 	Function: buildTranslations()
 * 	Description: Main function that fetches all of the Laravel translations
 * 		and creates appropiate nested objects for.
 *
 * 	@param absLangPath - The absolute path to Laravel lang/ directory
 * 	@param pluginConfiguration - Plugin configurations
 * 	@returns translations - Object/JSON version of Laravel Translations
 */
const buildTranslations = (absLangPath, pluginConfiguration) => {
    var _a;
    // # Define: Translation Object
    let translations = {};
    // # Define: Glob Regex
    const globRegex = pluginConfiguration.includeJson ? '**/*.{json,php}' : '**/*.php';
    // # Recursively: Fetch filenames as an array
    const files = glob_1.default.sync(absLangPath + path_1.default.sep + globRegex);
    // # Loop: Through each of the files and create object
    for (const file of files) {
        // # Define: File information
        const fileRaw = file.replace(absLangPath + path_1.default.sep, '');
        const fileExt = path_1.default.extname(fileRaw);
        const pathSplit = fileRaw.replace(fileExt, '').split(path_1.default.sep);
        // # Import/Parse: The .PHP/.JSON language file.
        const currentXlation = fileExt == '.php' ? php_array_reader_1.default.fromFile(file) : (_a = file, Promise.resolve().then(() => __importStar(require(_a))));
        // # Pre-Define: Initial Value for reducer
        const all = currentXlation;
        // # Generate: Nested Object from array
        const currentTranslationStructure = fileExt == '.php' ? pathSplit.reverse().reduce((all, item) => ({ [item]: all }), all) : currentXlation;
        // # Merge-Deep: Existing translations with current translations
        translations = mergeDeep(translations, currentTranslationStructure);
    }
    // # Return: Imported Laravel translations as JSON
    return translations;
};
exports.buildTranslations = buildTranslations;
/**
 * 	Function: mergeDeep()
 * 	Description: Method used to deeply merge objects that are nested.
 *
 * 	@param target - Main Object to merge into
 * 	@param source - Object 2 containing data to merge into main object
 * 	@returns target
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
        }
        else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    });
    return target;
};
//# sourceMappingURL=loader.js.map