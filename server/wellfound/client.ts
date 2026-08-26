import type { RawDocument } from "./types";

const DEFAULT_BASE_URL = "https://wellfound.com";
const WELLFOUND_COOKIE_ENV = "WELLFOUND_COOKIE";
/**
 * Low-level transport for wellfound.com.
 *
 * Responsibilities:
 * - perform requests with browser-like headers/cookies
 * - own retries/backoff and rate limiting shared by every operation
 * - normalize responses into {@link RawDocument} for the layers above
 */
interface WellfoundRequestOptions {
  operationName: string;
  variables: Record<string, unknown>;
  operationId: string;
}
export class WellfoundClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async wellFoundRequest({
    operationName,
    variables,
    operationId}:WellfoundRequestOptions
  ) {
    const cookie = process.env[WELLFOUND_COOKIE_ENV];

    if (!cookie) {
      throw new Error(`${WELLFOUND_COOKIE_ENV} is required for Wellfound requests.`);
    }

    const response = await fetch(`${this.baseUrl}/graphql`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: this.baseUrl,
        Referer: `${this.baseUrl}/`,
      },
      body: JSON.stringify({
        operationName,
        variables,
        extensions: {
          operationId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Wellfound request failed for ${operationName}: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Fetch an absolute path (e.g. "/jobs") and return the raw HTML document.
   *
   * TODO: wire up the HTTP/browser engine here.
   */
  async get(path: string): Promise<RawDocument> {
    throw new Error(
      `WellfoundClient.get("${this.baseUrl}${path}") is not implemented yet.`,
    );
  }
}



