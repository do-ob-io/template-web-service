/**
 * Health check result.
 */
export interface HealthStatus {
  status: string;
}

/**
 * Returns the current health status of the service.
 *
 * @returns The health status object.
 */
export function getHealthStatus(): HealthStatus {
  return { status: 'ok' };
}
