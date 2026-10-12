import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";
function files(root) {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? files(path.join(root, entry.name))
        : /\.tsx?$/.test(entry.name)
          ? [path.join(root, entry.name)]
          : [],
    );
}
test("frontend contains no local ten-percent commission arithmetic", () => {
  const failures = [];
  for (const file of files(fileURLToPath(new URL("../src", import.meta.url)))) {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    function inspect(node) {
      if (
        ts.isBinaryExpression(node) &&
        [ts.SyntaxKind.AsteriskToken, ts.SyntaxKind.SlashToken].includes(
          node.operatorToken.kind,
        )
      ) {
        const expression = node.getText(source);
        if (
          /commission|payout|settlement|earning|revenue|fare/i.test(
            node.parent.getText(source),
          ) &&
          (/\*\s*(?:0\.1(?:0)?\b|10\s*\/\s*100)/.test(expression) ||
            /\/\s*10\b/.test(expression))
        )
          failures.push(path.basename(file));
      }
      ts.forEachChild(node, inspect);
    }
    inspect(source);
  }
  assert.deepEqual(
    failures,
    [],
    "Commission must be returned by the backend, not calculated in the frontend",
  );
});
