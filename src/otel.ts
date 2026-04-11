import { FastifyOtelInstrumentation } from '@fastify/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NodeSDK } from '@opentelemetry/sdk-node';

/**
 * OpenTelemetry Node SDK setup for distributed tracing.
 *
 * This module must be imported before Fastify is initialised so that
 * `FastifyOtelInstrumentation` can intercept all route and hook registrations
 * via the `registerOnInitialization` option.
 *
 * Configuration via environment variables:
 * - `OTEL_SERVICE_NAME` — Service name used for trace attribution.
 * - `OTEL_EXPORTER_OTLP_ENDPOINT` — OTLP collector endpoint (default: `http://localhost:4318`).
 * - `OTEL_TRACES_EXPORTER` — Set to `none` to disable trace export entirely.
 *
 * @see https://opentelemetry.io/docs/languages/sdk-configuration/general/
 */
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [
    new HttpInstrumentation(),
    new FastifyOtelInstrumentation({ registerOnInitialization: true }),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().catch((error: Error) => console.error('OTEL SDK shutdown error:', error));
});
