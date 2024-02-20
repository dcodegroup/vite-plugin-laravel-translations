import { TranslationConfiguration } from '../types';
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
            LARAVEL_TRANSLATIONS: {};
        };
    }>;
    handleHotUpdate(context: HmrContext): void;
}>;
