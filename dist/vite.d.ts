import { TranslationConfiguration } from '../types/index';
import type { HmrContext } from 'vite';
/**
 * ##########################################
 * #			  MAIN FUNCTION 			#
 * ##########################################
 */
export default function laravelTranslations(pluginConfiguration?: TranslationConfiguration): Promise<{
    name: string;
    config(): {
        define: {
            LARAVEL_TRANSLATIONS: {};
        };
    };
    handleHotUpdate(context: HmrContext): void;
}>;
