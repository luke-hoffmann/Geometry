import fs from "fs";

fs.copyFileSync(
  "src/index.global.d.ts",
  "dist/index.global.d.ts"
);