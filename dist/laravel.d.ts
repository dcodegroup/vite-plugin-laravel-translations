/**
 * 	Function: determineLaravelVersion()
 *	Description: Used to determine laravel version to determine
 * 		the default path for language folder.
 *
 * 	@return Promise<Error|Number>
 */
export declare const determineLaravelVersion: () => Promise<number>;
/**
 * 	Function: getLangDir()
 * 	Description: Based on version, return the correct lang/
 *		folder path in absolute form.
 *
 * 	@param laravelVersion Number
 * 	@returns string
 */
export declare const getLangDir: (laravelVersion?: number) => string;
