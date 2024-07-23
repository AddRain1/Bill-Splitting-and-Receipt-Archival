import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    extends: ['plugin:testing-library/react', 'plugin:react-native/all'],
    languageOptions: { globals: {...globals.jest }},
  }
];