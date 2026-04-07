/**
 * JSON Schema for the health check response.
 *
 * Declared `as const` so that `@fastify/type-provider-json-schema-to-ts`
 * can statically infer TypeScript types.
 */
export const healthResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
  },
  required: [ 'status' ],
  additionalProperties: false,
} as const;
