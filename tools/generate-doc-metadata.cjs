#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const repoRoot = process.cwd();
const libRoot = path.join(repoRoot, 'projects', 'nsh-kit-ui', 'src', 'lib');
const registryPath = path.join(
  repoRoot,
  'projects',
  'demo',
  'src',
  'app',
  'showcase',
  'shared',
  'doc-registry.ts'
);
const outputPath = path.join(
  repoRoot,
  'projects',
  'demo',
  'src',
  'app',
  'showcase',
  'shared',
  'doc-source-metadata.ts'
);

const ENTRY_PATH_ALIASES = {
  icons: 'icon',
};

const API_KIND_ORDER = {
  component: 0,
  directive: 1,
  service: 2,
};

const SIGNAL_KIND_ORDER = {
  input: 0,
  model: 1,
  output: 2,
};

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFiles(fullPath));
    } else {
      out.push(fullPath);
    }
  }
  return out;
}

function toWorkspacePath(absolutePath) {
  return path.relative(repoRoot, absolutePath).split(path.sep).join('/');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseEntryIds() {
  const text = fs.readFileSync(registryPath, 'utf8');
  const start = text.indexOf('export const DOC_ENTRIES');
  const end = text.indexOf('];', start);
  const block = start >= 0 && end > start ? text.slice(start, end) : text;

  const ids = [];
  const idPattern = /id:\s*'([^']+)'/g;
  let match = null;

  while ((match = idPattern.exec(block))) {
    ids.push(match[1]);
  }

  return Array.from(new Set(ids));
}

function getDecoratorName(decorator) {
  const expr = decorator.expression;
  if (!ts.isCallExpression(expr)) {
    return null;
  }

  const callee = expr.expression;
  if (ts.isIdentifier(callee)) {
    return callee.text;
  }

  if (ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.name)) {
    return callee.name.text;
  }

  return null;
}

function getDecoratorObjectLiteral(decorator) {
  const expr = decorator.expression;
  if (!ts.isCallExpression(expr)) {
    return null;
  }

  const firstArg = expr.arguments[0];
  if (!firstArg || !ts.isObjectLiteralExpression(firstArg)) {
    return null;
  }

  return firstArg;
}

function getObjectPropertyInitializer(objectLiteral, name) {
  for (const prop of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(prop)) {
      continue;
    }

    if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) {
      if (prop.name.text === name) {
        return prop.initializer;
      }
    }
  }

  return null;
}

function readStringLiteralText(node) {
  if (!node) {
    return null;
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  return null;
}

function extractStylesFromDecorator(decoratorObject) {
  if (!decoratorObject) {
    return [];
  }

  const stylesInit = getObjectPropertyInitializer(decoratorObject, 'styles');
  if (!stylesInit) {
    return [];
  }

  if (ts.isStringLiteral(stylesInit) || ts.isNoSubstitutionTemplateLiteral(stylesInit)) {
    return [stylesInit.text];
  }

  if (!ts.isArrayLiteralExpression(stylesInit)) {
    return [];
  }

  const styles = [];
  for (const el of stylesInit.elements) {
    if (ts.isStringLiteral(el) || ts.isNoSubstitutionTemplateLiteral(el)) {
      styles.push(el.text);
    }
  }

  return styles;
}

function extractStyleTokens(styles) {
  const tokenSet = new Set();

  for (const styleText of styles) {
    const strictPattern = /(--nsh-[a-z0-9-]+)\s*:\s*var\(\s*\1\b/gi;
    let strictMatch = null;
    while ((strictMatch = strictPattern.exec(styleText))) {
      tokenSet.add(strictMatch[1]);
    }
  }

  return Array.from(tokenSet);
}

function rootCallInfo(expression) {
  let node = expression;
  let required = false;

  while (ts.isPropertyAccessExpression(node)) {
    if (node.name.text === 'required') {
      required = true;
    }
    node = node.expression;
  }

  if (!ts.isIdentifier(node)) {
    return null;
  }

  return { root: node.text, required };
}

function extractAlias(callExpression) {
  for (const arg of callExpression.arguments) {
    if (!ts.isObjectLiteralExpression(arg)) {
      continue;
    }

    const aliasInit = getObjectPropertyInitializer(arg, 'alias');
    const aliasText = readStringLiteralText(aliasInit);
    if (aliasText) {
      return aliasText;
    }
  }

  return null;
}

function inferTypeFromLiteral(node) {
  if (!node) {
    return 'unknown';
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return 'string';
  }

  if (ts.isNumericLiteral(node)) {
    return 'number';
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) {
    return 'boolean';
  }

  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return 'null';
  }

  return 'unknown';
}

function extractSignals(classNode, sourceFile) {
  const signals = [];

  for (const member of classNode.members) {
    if (!ts.isPropertyDeclaration(member) || !member.initializer) {
      continue;
    }

    if (!ts.isCallExpression(member.initializer)) {
      continue;
    }

    const call = member.initializer;
    const info = rootCallInfo(call.expression);
    if (!info || !['input', 'output', 'model'].includes(info.root)) {
      continue;
    }

    const signalName = ts.isIdentifier(member.name)
      ? member.name.text
      : member.name.getText(sourceFile);

    let signalType = 'unknown';
    if (call.typeArguments && call.typeArguments.length > 0) {
      signalType = call.typeArguments.map((arg) => arg.getText(sourceFile)).join(', ');
    } else if (member.type) {
      signalType = member.type.getText(sourceFile);
    } else {
      signalType = inferTypeFromLiteral(call.arguments[0]);
    }

    signals.push({
      name: signalName,
      alias: extractAlias(call),
      kind: info.root,
      type: signalType,
      required: info.required,
    });
  }

  signals.sort((left, right) => {
    const kindDiff = SIGNAL_KIND_ORDER[left.kind] - SIGNAL_KIND_ORDER[right.kind];
    if (kindDiff !== 0) {
      return kindDiff;
    }
    return left.name.localeCompare(right.name);
  });

  return signals;
}

function buildEntityKind(decoratorName) {
  if (decoratorName === 'Component') {
    return 'component';
  }
  if (decoratorName === 'Directive') {
    return 'directive';
  }
  return 'service';
}

function extractApiEntities(tsFilePath) {
  const sourceText = fs.readFileSync(tsFilePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    tsFilePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const entities = [];
  const componentStyleTokens = new Set();

  for (const node of sourceFile.statements) {
    if (!ts.isClassDeclaration(node) || !node.name) {
      continue;
    }

    const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : undefined;
    if (!decorators || decorators.length === 0) {
      continue;
    }

    for (const decorator of decorators) {
      const decoratorName = getDecoratorName(decorator);
      if (!decoratorName || !['Component', 'Directive', 'Injectable'].includes(decoratorName)) {
        continue;
      }

      const decoratorObject = getDecoratorObjectLiteral(decorator);
      const selector = readStringLiteralText(getObjectPropertyInitializer(decoratorObject, 'selector'));
      const exportAs = readStringLiteralText(getObjectPropertyInitializer(decoratorObject, 'exportAs'));

      const styleTokens = extractStyleTokens(extractStylesFromDecorator(decoratorObject));
      for (const token of styleTokens) {
        componentStyleTokens.add(token);
      }

      entities.push({
        name: node.name.text,
        kind: buildEntityKind(decoratorName),
        selector: selector ?? null,
        exportAs: exportAs ?? null,
        source: toWorkspacePath(tsFilePath),
        signals: extractSignals(node, sourceFile),
      });
    }
  }

  return {
    entities,
    styleTokens: Array.from(componentStyleTokens),
  };
}

function collectEntryFiles(allLibTsFiles, entryId) {
  const key = ENTRY_PATH_ALIASES[entryId] ?? entryId;
  const pattern = new RegExp(`[\\\\/]${escapeRegex(key)}[\\\\/]`);

  return allLibTsFiles.filter((filePath) => pattern.test(filePath));
}

function main() {
  const entryIds = parseEntryIds();
  const allLibTsFiles = listFiles(libRoot).filter(
    (filePath) =>
      filePath.endsWith('.ts') &&
      !filePath.endsWith('.spec.ts') &&
      !filePath.endsWith('.integration.spec.ts') &&
      !filePath.endsWith('index.ts') &&
      !filePath.endsWith('public-api.ts')
  );

  const metadata = {};

  for (const entryId of entryIds) {
    const files = collectEntryFiles(allLibTsFiles, entryId);

    const apiEntities = [];
    const stylingTokenMap = new Map();

    for (const filePath of files) {
      const extracted = extractApiEntities(filePath);
      for (const entity of extracted.entities) {
        apiEntities.push(entity);
      }

      for (const token of extracted.styleTokens) {
        if (!stylingTokenMap.has(token)) {
          stylingTokenMap.set(token, toWorkspacePath(filePath));
        }
      }
    }

    apiEntities.sort((left, right) => {
      const kindDiff = API_KIND_ORDER[left.kind] - API_KIND_ORDER[right.kind];
      if (kindDiff !== 0) {
        return kindDiff;
      }
      return left.name.localeCompare(right.name);
    });

    const stylingTokens = Array.from(stylingTokenMap.entries())
      .map(([name, source]) => ({ name, source }))
      .sort((left, right) => left.name.localeCompare(right.name));

    metadata[entryId] = {
      api: apiEntities,
      stylingTokens,
    };
  }

  const fileText = `/* eslint-disable */\n` +
`// Generated by tools/generate-doc-metadata.cjs\n` +
`// Do not edit by hand.\n\n` +
`export type DocApiKind = 'component' | 'directive' | 'service';\n` +
`export type DocSignalKind = 'input' | 'output' | 'model';\n\n` +
`export interface DocSignalMetadata {\n` +
`  name: string;\n` +
`  alias: string | null;\n` +
`  kind: DocSignalKind;\n` +
`  type: string;\n` +
`  required: boolean;\n` +
`}\n\n` +
`export interface DocApiTargetMetadata {\n` +
`  name: string;\n` +
`  kind: DocApiKind;\n` +
`  selector: string | null;\n` +
`  exportAs: string | null;\n` +
`  source: string;\n` +
`  signals: ReadonlyArray<DocSignalMetadata>;\n` +
`}\n\n` +
`export interface DocStylingTokenMetadata {\n` +
`  name: string;\n` +
`  source: string;\n` +
`}\n\n` +
`export interface DocEntryMetadata {\n` +
`  api: ReadonlyArray<DocApiTargetMetadata>;\n` +
`  stylingTokens: ReadonlyArray<DocStylingTokenMetadata>;\n` +
`}\n\n` +
`export const DOC_ENTRY_METADATA: Readonly<Record<string, DocEntryMetadata>> = ${JSON.stringify(metadata, null, 2)};\n`;

  fs.writeFileSync(outputPath, fileText);

  const totalEntities = Object.values(metadata).reduce((sum, item) => sum + item.api.length, 0);
  const totalSignals = Object.values(metadata).reduce(
    (sum, item) => sum + item.api.reduce((inner, entity) => inner + entity.signals.length, 0),
    0
  );
  const totalTokens = Object.values(metadata).reduce((sum, item) => sum + item.stylingTokens.length, 0);

  console.log(
    `Generated ${toWorkspacePath(outputPath)} (entries: ${entryIds.length}, api targets: ${totalEntities}, signals: ${totalSignals}, styling tokens: ${totalTokens})`
  );
}

main();
