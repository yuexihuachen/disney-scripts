import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

module.exports = [
  { 
    files: ['client/**/*.{js,jsx,ts,tsx}', 'server/**/*.{js,jsx,ts,tsx}'],
   },
   {
    ignores: ["node_modules/", "dist/"]
  },
  { 
    languageOptions: { globals: globals.browser }
  },
  {
      rules: {
          "no-unused-vars": "warn",
          "no-undef": "warn",
          "no-console": 'warn'
      }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
