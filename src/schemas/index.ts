/**
 * JSON Schema definitions for request bodies and responses.
 *
 * Schemas are declared `as const` so that `@fastify/type-provider-json-schema-to-ts`
 * can statically infer TypeScript types directly from the schema literals.
 */

export const healthResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
  },
  required: [ 'status' ],
  additionalProperties: false,
} as const;

export const echoBodySchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: [ 'message' ],
  additionalProperties: false,
} as const;

export const echoResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: [ 'message' ],
  additionalProperties: false,
} as const;
