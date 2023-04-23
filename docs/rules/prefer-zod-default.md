# Prefer `.default()` over `default` in `.openapi()` (`prefer-zod-default`)

Provides an error when `default` is used in `.openapi()` option. ZodDefault `.default()` should be used instead.

A simple example

```ts
const NameSchema = z.string().openapi({ example: 'Fred', default: 'Fred' }); // ❌ error
const NameSchema = z.string().default('Fred').openapi({ example: 'Fred' }); // ✅ correct
```
