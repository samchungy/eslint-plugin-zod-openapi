# Prefers that the `.openapi()` method be the last method (`prefer-openapi-last`)

Prefers that the `.openapi()` method be the last method in a Zod Schema chain. This is done mainly out of consistency but also because there are some methods that can override the `.openapi()` method. eg. pick, omit

A simple example

```ts
const NameSchema = z.string().openapi({ example: 'Fred' }).length(5); // ❌ error

const NameSchema = z.string().length(5).openapi({ example: 'Fred' }); // ✅ correct
```
