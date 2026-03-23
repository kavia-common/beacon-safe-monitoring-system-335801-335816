export class ApiError extends Error {
  status: number;
  url: string;
  details?: unknown;

  constructor(params: { message: string; status: number; url: string; details?: unknown }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.url = params.url;
    this.details = params.details;
  }
}

export interface ApiClientOptions {
  /**
   * Base URL for API requests. Default is `/api` so the Vite dev proxy can route to backend.
   * This should *not* include a trailing slash.
   */
  baseUrl?: string;
  /**
   * Bearer token. If provided, will be attached as `Authorization: Bearer <token>`.
   */
  token?: string | null;
}

export interface ApiRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  operation: string; // for debugging/observability
  body?: unknown;
}

/**
 * Create an API client with a stable request flow.
 *
 * Contract:
 * - Inputs: {baseUrl, token} and per-request {method, path, operation, body}
 * - Output: parsed JSON typed as T (or void if response has no body)
 * - Errors: throws ApiError for non-2xx responses or network/parse issues
 * - Side effects: network call via fetch
 */
export function createApiClient(options: ApiClientOptions) {
  const baseUrl = (options.baseUrl ?? "/api").replace(/\/$/, "");
  const token = options.token ?? null;

  async function request<T>(req: ApiRequestOptions): Promise<T> {
    const url = `${baseUrl}${req.path.startsWith("/") ? req.path : `/${req.path}`}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: req.body === undefined ? undefined : JSON.stringify(req.body)
      });
    } catch (err) {
      throw new ApiError({
        message: `[${req.operation}] Network error contacting API`,
        status: 0,
        url,
        details: err
      });
    }

    // Best-effort parse error details
    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json().catch(() => undefined) : undefined;

    if (!response.ok) {
      throw new ApiError({
        message: `[${req.operation}] API error (${response.status})`,
        status: response.status,
        url,
        details: payload
      });
    }

    return payload as T;
  }

  return { request };
}
