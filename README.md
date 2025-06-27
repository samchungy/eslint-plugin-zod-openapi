# eslint-plugin-zod-openapi

This is a set of Eslint rules created for use with [zod-openapi](https://github.com/samchungy/zod-openapi). This aims to optimise the overall developer experience with a little sprinkle of magic ✨.

[![npm version](https://img.shields.io/npm/v/eslint-plugin-zod-openapi)](https://www.npmjs.com/package/eslint-plugin-zod-openapi)
[![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-zod-openapi)](https://www.npmjs.com/package/eslint-plugin-zod-openapi)
[![Node.js version](https://img.shields.io/badge/node-%3E%3D%2016.11-brightgreen)](https://nodejs.org/en/)
[![Powered by skuba](https://img.shields.io/badge/🤿%20skuba-powered-009DC4)](https://github.com/seek-oss/skuba)

## Installation

To install simply run on yarn, npm or pnpm

```bash
yarn add -D eslint-plugin-zod-openapi
# or
npm i -D eslint-plugin-zod-openapi
# or
pnpm i -D eslint-plugin-zod-openapi
```

Add the following configuration to your `.eslintrc` file

```js
{
  "plugins": ["zod-openapi"]
}
```

```js
{
  "rules": {
    "zod-openapi/require-meta": "error"
    "zod-openapi/require-comment": "error",
    "zod-openapi/prefer-zod-default": "warn",
  }
}
```

You may wish to use overrides as this plugin by default will assume that all Zod Objects are using zod-openapi.

```js
"overrides": [
    {
      "files": ["src/api-types/*.ts"],
      "rules": {
        "zod-openapi/require-meta": "error"
      }
    }
  ]
```

## Rules

🔧 This rule is automatically fixable by the [--fix CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

| Name                                                     | Description                                                                 | 🔧  |
| -------------------------------------------------------- | --------------------------------------------------------------------------- | :-: |
| [require-meta](./docs/rules/require-meta.md)             | Requires that all ZodTypes have an `.meta()` method.                        |     |
| [require-comment](./docs/rules/require-comment.md)       | Requires that all ZodTypes have a `description` and matching JSDoc comment. | ✅  |
| [require-example](./docs/rules/require-example.md)       | Requires that all ZodTypes have an `example` or `examples` field.           |     |
| [prefer-meta-last](./docs/rules/prefer-meta-last.md)     | Prefers that the `.meta()` method be the last method in the ZodType chain.  |     |
| [prefer-zod-default](./docs/rules/prefer-zod-default.md) | Provides an error when `default` in `.meta()` is used                       |     |

## Development

### Test

```shell
pnpm test
```

### Lint

```shell
# Fix issues
pnpm format

# Check for issues
pnpm lint
```

### Release

To release a new version

1. Create a [new GitHub Release](https://github.com/samchungy/eslint-plugin-zod-openapi/releases/new)
2. Select `🏷️ Choose a tag`, enter a version number. eg. `v1.2.0` and click `+ Create new tag: vX.X.X on publish`.
3. Click the `Generate release notes` button and adjust the description.
4. Tick the `Set as the latest release` box and click `Publish release`. This will trigger the `Release` workflow.
5. Check the `Pull Requests` tab for a PR labelled `Release vX.X.X`.
6. Click `Merge Pull Request` on that Pull Request to update master with the new package version.

To release a new beta version

1. Create a [new GitHub Release](https://github.com/samchungy/eslint-plugin-zod-openapi/releases/new)
2. Select `🏷️ Choose a tag`, enter a version number with a `-beta.X` suffix eg. `v1.2.0-beta.1` and click `+ Create new tag: vX.X.X-beta.X on publish`.
3. Click the `Generate release notes` button and adjust the description.
4. Tick the `Set as a pre-release` box and click `Publish release`. This will trigger the `Prerelease` workflow.
