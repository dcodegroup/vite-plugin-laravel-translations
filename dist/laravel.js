"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLangDir = exports.determineLaravelVersion = void 0;
/**
 * ##########################################
 * #			     IMPORTS	 			#
 * ##########################################
 */
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * 	Function: determineLaravelVersion()
 *	Description: Used to determine laravel version to determine
 * 		the default path for language folder.
 *
 * 	@return Promise<Error|Number>
 */
const determineLaravelVersion = () => {
    // # Read: Composer.json to determine file
    return new Promise(function (resolveVersion, rejectVersion) {
        fs_1.default.readFile('composer.json', 'utf8', function (fileError, fileData) {
            // # Reject: Read File Error
            if (fileError) {
                rejectVersion(fileError);
            }
            // # Extract: Laravel Version
            const composer = JSON.parse(fileData);
            const laravelVersionRaw = composer.require['laravel/framework'];
            const laravelVersion = parseInt(laravelVersionRaw.split('.')[0].replace(/\D/g, ''));
            // # Resolve: Laravel Version
            resolveVersion(laravelVersion);
        });
    });
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
    return [9, 10].includes(laravelVersion) ? path_1.default.resolve('lang/') : path_1.default.resolve('resources/lang');
};
exports.getLangDir = getLangDir;
//# sourceMappingURL=laravel.js.map