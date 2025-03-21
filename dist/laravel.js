"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLangDir = exports.determineLaravelVersion = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
/**
 * 	Function: determineLaravelVersion()
 *	Description: Used to determine laravel version to determine
 * 		the default path for language folder.
 *
 * 	@param composerPath string (default: 'composer.json') The path to composer.json file, in case it's not in root.
 *
 * 	@return Promise<Error|Number> The current Laravel version
 */
const determineLaravelVersion = async (composerPath = 'composer.json') => {
    // eslint-disable-next-line no-useless-catch
    try {
        // Read Composer.json to determine the file
        const fileData = await fs_1.promises.readFile(composerPath, 'utf8');
        // Extract Laravel Version
        const composer = JSON.parse(fileData);
        const laravelVersionRaw = composer.require['laravel/framework'];
        // Extract Laravel Version using the first (0) index
        const [laravelVersionString] = laravelVersionRaw.split('.');
        // Parse Laravel Version to Integer
        const laravelVersion = parseInt(laravelVersionString.replace(/\D/g, ''));
        // Return Laravel Version (e.g. 11)
        return laravelVersion;
    }
    catch (exception) {
        // Throw exception if composer.json file is not found
        throw exception;
    }
};
exports.determineLaravelVersion = determineLaravelVersion;
/**
 * 	Function: getLangDir()
 * 	Description: Based on version, return the correct lang/
 *		folder path in absolute form.
 *
 * 	@param laravelVersion number
 * 	@returns string
 */
const getLangDir = (laravelVersion = 9) => {
    // # Return: Absolute path to Laravel lang/ folder
    return laravelVersion >= 9 ? path_1.default.resolve('lang/') : path_1.default.resolve('resources/lang');
};
exports.getLangDir = getLangDir;
