# Prefer `.default()` over `default` in `.meta()` (`prefer-zod-default`)

Provides an error when `default` is used in `.meta()` option. ZodDefault `.default()` should be used instead.

A simple example

```ts
const NameSchema = z.string().meta({ example: 'Fred', default: 'Fred' }); // ❌ error
const NameSchema = z.string().default('Fred').meta({ example: 'Fred' }); // ✅ correct
```
