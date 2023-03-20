/**
 * ##########################################
 * #			     IMPORTS	 			#
 * ##########################################
 */
import path from 'path';
import fs from 'fs';

/**
 * 	Function: determineLaravelVersion()
 *	Description: Used to determine laravel version to determine
 * 		the default path for language folder.
 *
 * 	@return Promise<Error|Number>
 */
export const determineLaravelVersion = () => {
  // # Read: Composer.json to determine file
  return new Promise<number>(function (resolveVersion, rejectVersion) {
    fs.readFile('composer.json', 'utf8', function (fileError: NodeJS.ErrnoException | null, fileData: string) {
      // # Reject: Read File Error
      if (fileError) {
        rejectVersion(fileError);
      }

      // # Extract: Laravel Version
      const composer = JSON.parse(fileData);
      const laravelVersionRaw = composer.require['laravel/framework'];
      const laravelVersion = laravelVersionRaw.split('.')[0].replace(/\D/g, '');

      // # Resolve: Laravel Version
      resolveVersion(laravelVersion);
    });
  });
};

/**
 * 	Function: getLangDir()
 * 	Description: Based on version, return the correct lang/
 *		folder path in absolute form.
 *
 * 	@param laravelVersion Number
 * 	@returns string
 */
export const getLangDir = (laravelVersion = 9) => {
  // # Return: Absolute path to Laravel lang/ folder
  return laravelVersion >= 9 ? path.resolve('lang/') : path.resolve('resources/lang');
};
