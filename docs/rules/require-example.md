# Requires an `example` on Zod Types (`require-example`)

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

## Options

By default this rule looks for the `example` key. If you wish to use the `examples` key which is required in Open API 3.1 pass the key `examples` in the options argument of your rule configuration.

eg. `'zod-openapi/require-example': ['error', 'examples']`
