/**
 * ##########################################
 * #			        DECLARE TYPES 			      #
 * ##########################################
 */

export declare interface TranslationConfiguration {
  namespace?: string | false;
  // # [TO_DO]: Implement JSON files
  includeJson?: boolean;
  assertJsonImport?: boolean; // Optional param to include JSON files using assert when importing translations
  absoluteLanguageDirectory?: string | null; // Optional param to override default langDir if needed
  interpolation?: InterpolationConfiguration | null;
}

export declare interface InterpolationConfiguration {
  prefix: string;
  suffix: string;
}

// Define the translation content interpolable type
export declare type TranslationContentInterpolable = {
  pluginConfiguration: TranslationConfiguration;
  fileExtension: string;
  file: string;
};
