# eslint-plugin-zod-to-openapi

[![npm version](https://img.shields.io/npm/v/eslint-plugin-zod-to-openapi)](https://www.npmjs.com/package/eslint-plugin-zod-to-openapi)
[![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-zod-to-openapi)](https://www.npmjs.com/package/eslint-plugin-zod-to-openapi)
[![Powered by skuba](https://img.shields.io/badge/🤿%20skuba-powered-009DC4)](https://github.com/seek-oss/skuba)

## Intoduction

This is a set of Eslint rules created for use with [@asteasolutions/zod-to-openapi]. As a contributor and major user of the library, there are some learnings with using the library by itself and this package hopes to address those issues as well as optimise the overall developer experience with a sprinkle of magic ✨.

## Table of Contents

- [Installation](#installation)
- [Rules](#rules)
  - [require-openapi](#require-openapi)
  - [require-comment 🔧](#require-comment-)
  - [require-example](#require-example)
  - [prefer-openapi-last](#prefer-openapi-last)
  - [prefer-zod-default](#prefer-zod-default)
- [Development](#development)
  - [Test](#test)
  - [Lint](#lint)
  - [Package](#package)
- [Release](#release)
  - [Commit messages](#commit-messages)
  - [Releasing latest](#releasing-latest)
  - [Releasing other dist-tags](#releasing-other-dist-tags)

## Installation

To install simply run on yarn or npm

```bash
yarn add -D eslint-plugin-zod-to-openapi
# or
npm i -D eslint-plugin-zod-to-openapi
```

Add the following configuration to your `.eslintrc` file

```js
{
  "plugins": ["zod-to-openapi"]
}
```

```js
{
  "rules": {
    "zod-to-openapi/require-openapi": "error"
    "zod-to-openapi/require-comment": "error",
    "zod-to-openapi/prefer-zod-default": "warn",
  }
}
```

You may wish to use overrides as this plugin by default will assume that all Zod Objects are using zod-to-openapi.

```js
"overrides": [
    {
      "files": ["src/api-types/*.ts"],
      "rules": {
        "zod-to-openapi/require-openapi": "error"
      }
    }
  ]
```

## Rules

🔧 = autofixable

### require-openapi

Requires that all Zod schemas have an `.openapi()` method. In order for your generated documentation to appear nice, you need to provide metadata for your types.

A simple example

```ts
const NameSchema = z.string(); // ❌ error
const NameSchema = z.string().openapi({ description: "A user's name" }); // ✅ correct
```

This rule is best used in conjunction with the require-comment rule. To avoid costly traversal we use the Typescript compiler to check the type and also consider any referenced variable which has a jsDoc comment as having an `.openapi()` field.

A complex example

```ts
/**
 * A user's name
 **/
const NameSchema = z.string().openapi({ description: "A user's name" });

const IdSchema = z.string().uuid();

/**
 * Other Schema
 **/
const OtherSchema = z
  .object({
    /**
     * A user's age
     **/
    age: z.number().openapi({ description: "A user's age" }),
  })
  .openapi({ description: 'Other Schema' });

const PersonSchema = z
  .object({
    /**
     * A user's name
     **/
    name: NameSchema, // ✅ correct
    id: IdSchema, // ❌ error (IdSchema has no comment)
    /**
     * A user's name
     **/
    age: OtherSchema.shape.age, // ✅ correct
  })
  .openapi({ description: 'Person' });
```

This rule also requires that all Zod Schemas in the `OpenAPIRegistry.register` method require an `.openapi()` method.

```ts
const registry = new OpenAPIRegistry();

export const ZodObject = registry.register(
  'registered',
  z.string().openapi({ description: 'hello' }), // ✅ correct
);
```

### require-comment 🔧

This rule was rhe inspiration for the entire package. It requires that all Zod schemas which have an `.openapi()` object have a `description` and matching jsDoc comment.

In order for your IDE to display descriptions in inferred types, it requires JsDoc comments. This rule autogenerates comments based on your `description` `example` or `examples` and `deprecated` fields and adds it to your ZodSchema. These appear in both the inferred and actual ZodSchema. This rule is autofixable.

A simple example

```ts
const NameSchema = z.string().openapi({ example: 'Fred' }); // ❌ error (no description or comment)

/**
 * A user's name
 **/
const NameSchema = z
  .string()
  .openapi({ description: "A user's name", example: 'Fred' }); // ✅ correct
```

This rule is also able to infer JsDoc comments from other variables and automatically copies the comments across where otherwise you would gain no type comments.

A more complex example:

```ts
/**
 * @deprecated A user's name
 **/
const NameSchema = z
  .string()
  .openapi({ description: "A user's name", example: 'Fred', deprecated: true }); // ✅ correct

/**
 * Person
 **/
const PersonSchema = z
  .object({
    /**
     * @deprecated A user's name  // ℹ️ this comment is synced with NameSchema
     **/
    name: NameSchema, // ℹ️ This type will be marked as deprecated in your IDE
    /**
     * A user's age
     **/
    age: z
      .number()
      .positive()
      .int()
      .openapi({ description: "A user's age", example: 12 }),
  })
  .openapi({ description: 'Person' });

/**
 * Person
 **/
type Person = z.infer<typeof PersonSchema>; // ℹ️ This comment is synced with PersonSchema. This does not work for indexed access eg. z.infer<typeof PersonSchema>['name'].
```

### require-example

Requires that the `.openapi()` method contains an `example`, `examples` key for Zod primatives. This makes our generated documentation much nicer. This includes:

- ZodBoolean
- ZodNumber
- ZodString
- ZodRecord
- ZodEnum

```ts
const UserIdSchema = z.string().uuid(); // ❌ error (no example)
const UserIdSchema = z
  .string()
  .uuid()
  .openapi({ example: '48948579-f117-47e4-bc05-12f28e7fdccd' }); // ✅ correct
```

By default this rule looks for the `example` key. If you wish to use the `examples` key which is required in Open API 3.1 pass the key `examples` in the options argument of your rule configuration.

eg. `'zod-to-openapi/require-example': ['error', 'examples']`

### prefer-openapi-last

Prefers that the `.openapi()` method be the last call in a Zod Schema chain. This is done mainly out of consistency but also because there are some methods that can override the `.openapi()` method. eg. pick, omit

A simple example

```ts
const NameSchema = z.string().openapi({ example: 'Fred' }).length(5); // ❌ error

const NameSchema = z.string().length(5).openapi({ example: 'Fred' }); // ✅ correct
```

### prefer-zod-default

Provides an error when the `.openapi() default` option is provided. ZodDefault should be used instead.

A simple example

```ts
const NameSchema = z.string().openapi({ example: 'Fred', default: 'Fred' }); // ❌ error
const NameSchema = z.string().default('Fred').openapi({ example: 'Fred' }); // ✅ correct
```

## Development

### Test

```shell
yarn test
```

### Lint

```shell
# Fix issues
yarn format

# Check for issues
yarn lint
```

### Package

```shell
# Compile source
yarn build

# Review bundle
npm pack
```

## Release

This package is published to the public npm registry with a GitHub Actions [release workflow].

The workflow runs on select branches:

```yaml
on:
  push:
    branches:
      # add others as necessary
      - beta
      - master
      # - alpha
```

It depends on this repo being hosted on [seek-oss] with appropriate access.

To set up this repo for publishing, follow the instructions in our [OSS npm package guidance].

### Commit messages

This package is published with **[semantic-release]**, which requires a particular commit format to manage semantic versioning.
You can run the interactive `yarn commit` command in place of `git commit` to generate a compliant commit title and message.
If you use the `Squash and merge` option on pull requests, take extra care to format the squashed commit in the GitHub UI before merging.

### Releasing latest

Commits to the `master` branch will be released with the `latest` tag,
which is the default used when running `npm install` or `yarn install`.

### Releasing other dist-tags

**[semantic-release]** prescribes a branch-based workflow for managing [distribution tags].

You can push to other branches to manage betas, maintenance updates to prior major versions, and more.

Here are some branches that **semantic-release** supports by default:

| Git branch | npm dist-tag |
| :--------- | :----------- |
| master     | latest       |
| alpha      | alpha        |
| beta       | beta         |
| next       | next         |
| 1.x        | release-1.x  |

For more information, see the **semantic-release** docs on [triggering a release].

[distribution tags]: https://docs.npmjs.com/adding-dist-tags-to-packages
[release workflow]: .github/workflows/release.yml
[semantic-release]: https://github.com/semantic-release/semantic-release
[triggering a release]: https://github.com/semantic-release/semantic-release/#triggering-a-release
[@asteasolutions/zod-to-openapi]: https://github.com/asteasolutions/zod-to-openapi
