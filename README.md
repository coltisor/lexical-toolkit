# Lexical Toolkit

## Introduction

Your comprehensive toolset for effortless and flexible Lexical development, equipped with essential features.

## Features

Hooks

- `useLexicalToolbar`
- `useHyperlinkEditor`

Nodes

- `KeywordNode`, `$createKeywordNode`, `$isKeywordNode`

Plugins

- `ControlledValuePlugin`
- `DefaultValuePlugin`
- `HyperlinkPlugin`
- `KeywordPlugin`
- `OnChangeContentPlugin`
- `OnFocusOnBlurPlugin`

Utilities

- `getSelectedNode`
- `convertHtmlToNodes`
- `sanitizeUrl`, `validateUrl`

More features are to come.

## Installation

Install the package using npm or yarn:

```bash
npm install lexical-toolkit
yarn add lexical-toolkit
```

## Usage

To use a component or utility from the toolkit, simply import it into your project:

```javascript
import { useLexicalToolbar } from "lexical-toolkit";
```

As of now, detailed documentation for each component and utility is still under development. In the meantime, you can refer to the TypeScript types provided with the package to understand how to use the various features.

Additionally, for practical examples, check out the [playground](https://github.com/coltisor/lexical-toolkit/tree/main/packages/playground) within the repository.

## Contributing

Contributions, feedback, and bug reports are welcome. Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
