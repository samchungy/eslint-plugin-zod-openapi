# Require `.meta()` on ZodTypes (`require-meta`)

Requires that all Zod schemas have an `.meta()` method. In order for your generated documentation to appear nice, you need to provide metadata for your types.

A simple example

```ts
const NameSchema = z.string(); // ❌ error
const NameSchema = z.string().meta({ description: "A user's name" }); // ✅ correct
```

This rule is best used in conjunction with the require-comment rule. To avoid costly traversal we use the Typescript compiler to check the type and also consider any referenced variable which has a JSDoc comment as having an `.meta()` field.

A complex example

```ts
/**
 * A user's name
 **/
const NameSchema = z.string().meta({ description: "A user's name" });

const IdSchema = z.string().uuid();

/**
 * Other Schema
 **/
const OtherSchema = z
  .object({
    /**
     * A user's age
     **/
    age: z.number().meta({ description: "A user's age" }),
  })
  .meta({ description: 'Other Schema' });

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
  .meta({ description: 'Person' });
```
