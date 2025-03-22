import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 例として、Next.jsの設定を拡張する場合は下記のように記述できます
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    // プラグインの登録
    plugins: {
      import: eslintPluginImport,
      "unused-imports": eslintPluginUnusedImports,
    },
    // 各プラグイン固有のルールをここで定義可能
    rules: {
      // 例:
      "import/order": "warn",
      "unused-imports/no-unused-imports": "error",
    },
  },
];

export default eslintConfig;
