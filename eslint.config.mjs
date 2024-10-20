import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    // "plugin:security/recommended",
).map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.js", "**/*.json"],
})), {
    files: ["**/*.ts", "**/*.js", "**/*.json"],

    plugins: {
        prettier,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.jest,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",
    },

    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
            },
        },
    },

    rules: {
        "max-len": [2, 120, 2],
        "no-console": "warn",
        "no-prototype-builtins": "warn",

        "prettier/prettier": ["error", {
            semi: true,
        }],

        "prefer-promise-reject-errors": "off",
        camelcase: "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-var-requires": "off",
    },
    ignores: [
		".gitignore",
		"dist/",
		"node_modules/",
		"package.json",
		"tsconfig.json",
	],
}];