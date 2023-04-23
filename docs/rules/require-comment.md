# Require a JSDoc comment on ZodTypes (`require-comment`)

🔧 This rule is automatically fixable by the [--fix CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

This rule was rhe inspiration for the entire package. It requires that all Zod schemas have a `description` and matching JSDoc comment.

In order for your IDE to display descriptions in inferred types, it requires JSDoc comments. This rule autogenerates comments based on your `description` `example` or `examples` and `deprecated` fields and adds it to your ZodSchema. These appear in both the inferred and actual ZodSchema.

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

This rule is also able to infer JSDoc comments from other variables and automatically copies the comments across where otherwise you would gain no type comments.

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
