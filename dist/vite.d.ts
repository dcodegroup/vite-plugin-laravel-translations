import { TranslationConfiguration } from '../types/index.js';
import type { HmrContext } from 'vite';
/**
 * ##########################################
 * #			  MAIN FUNCTION 			#
 * ##########################################
 */
export default function laravelTranslations(pluginConfiguration?: TranslationConfiguration): Promise<{
    name: string;
    config(): Promise<{
        define: {
            LARAVEL_TRANSLATIONS: object;
        };
    }>;
    handleHotUpdate(context: HmrContext): void;
}>;
