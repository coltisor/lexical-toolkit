"use strict";

const path = require("path");
const ts = require("typescript");
const fs = require("fs");

const packages = [
  {
    modules: [
      {
        outputFileName: "LexicalToolkit",
        sourceFileName: "index.ts",
      },
    ],
    name: "Lexical Toolkit Core",
    outputPath: "./packages/core/dist/",
    packageName: "lexical-toolkit",
    sourcePath: "./packages/core/src/",
  },
];

function getFileName(fileName, isProduction) {
  // Adjust this function to derive the file name based on your needs
  return isProduction ? `${fileName}.min.js` : `${fileName}.js`;
}

function compile(fileNames, options, outputPath) {
  let program = ts.createProgram(fileNames, options);
  let emitResult = program.emit();

  // Handling diagnostics
  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  if (emitResult.emitSkipped) {
    throw new Error("TypeScript compilation failed");
  }
}

async function build(name, inputFile, outputPath, outputFile, isProduction) {
  console.log(`Building ${name}...`);

  const tsConfigPath = ts.findConfigFile(
    "./",
    ts.sys.fileExists,
    "tsconfig.json"
  );
  if (!tsConfigPath) {
    throw new Error("Could not find a valid tsconfig.json.");
  }

  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  const compilerOptions = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    "./"
  ).options;

  compile([inputFile], compilerOptions, outputPath);

  console.log(`${name} built successfully.`);
}

// isProduction should be set based on your environment or build command
const isProduction = process.env.NODE_ENV === "production";

async function buildAll() {
  for (const pkg of packages) {
    const { name, sourcePath, outputPath, packageName, modules } = pkg;

    for (const module of modules) {
      const { sourceFileName, outputFileName } = module;
      let inputFile = path.resolve(path.join(`${sourcePath}${sourceFileName}`));

      await build(
        `${name}${module.name ? "-" + module.name : ""}`,
        inputFile,
        outputPath,
        path.resolve(
          path.join(`${outputPath}${getFileName(outputFileName, isProduction)}`)
        ),
        isProduction
      );
    }
  }
}

buildAll();
