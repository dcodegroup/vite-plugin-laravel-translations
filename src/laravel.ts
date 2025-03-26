/**
 * ------------------------------------------------
 *  # Import: Dependencies
 * ------------------------------------------------
 */
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

/**
 *	Determine laravel version for language folder.
 *
 * 	@param composerPath string - Path to composer.json file
 * 	@return number - Laravel Version
 */
export const determineLaravelVersion = (composerPath: string = "composer.json"): number => {
  try {
    // # Read: Composer.json to determine the file
    const fileData = readFileSync(composerPath, { encoding: "utf8" });

    // Extract: Laravel Version
    const composer = JSON.parse(fileData);

    // # Extract: Laravel Version using the first (0) index
    const [laravelVersionString] = composer.require["laravel/framework"].split(".");

    // # Return: Laravel Version as Integer
    return parseInt(laravelVersionString.replace(/\D/g, ""));
  } catch (exception: any) {
    // Throw exception if composer.json file is not found
    throw exception;
  }
};

/**
 * 	Based on version, return the correct lang/folder path in
 *  absolute form.
 *
 * 	@param laravelVersion number
 * 	@returns string - Absolute path to Laravel lang/ folder
 *
 */
export const getLangDir = (laravelVersion: number = 9) => (laravelVersion >= 9 ? resolve("lang/") : resolve("resources/lang"));
