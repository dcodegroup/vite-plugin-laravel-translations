/**
 * 	Function: determineLaravelVersion()
 *	Description: Used to determine laravel version to determine
 * 		the default path for language folder.
 *
 * 	@param composerPath string (default: 'composer.json') The path to composer.json file, in case it's not in root.
 *
 * 	@return Promise<Error|Number> The current Laravel version
 */
export declare const determineLaravelVersion: (composerPath?: string) => Promise<number>;
/**
 * 	Function: getLangDir()
 * 	Description: Based on version, return the correct lang/
 *		folder path in absolute form.
 *
 * 	@param laravelVersion number
 * 	@returns string
 */
export declare const getLangDir: (laravelVersion?: number) => string;
