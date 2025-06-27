# Prefers that the `.meta()` method be the last method (`prefer-meta-last`)

Prefers that the `.meta()` method be the last method in a Zod Schema chain. This is done mainly out of consistency but also because there are some methods that can override the `.meta()` method. eg. pick, omit

A simple example

```ts
const NameSchema = z.string().meta({ example: 'Fred' }).length(5); // ❌ error

const NameSchema = z.string().length(5).meta({ example: 'Fred' }); // ✅ correct
```
