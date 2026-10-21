import axios from "axios";

// Request logging is on unless VITE_LOG_REQUESTS=false
const LOG_REQUESTS = import.meta.env.VITE_LOG_REQUESTS !== "false";

const STATUS_STYLE = {
  ok: "color:#38a169",
  warn: "color:#dd6b20",
  error: "color:#e53e3e",
};

let sequence = 0;

// Keep API keys out of the console
const redact = (url) => url.replace(/([?&](?:token|key|apikey)=)[^&]+/gi, "$1***");

const describe = (config) => `${config.method.toUpperCase()} ${redact(axios.getUri(config))}`;

const elapsed = (config) => `${Math.round(performance.now() - config.metadata.start)}ms`;

/**
 * axios instance that logs every outgoing request and its response or failure
 * with latency, plus the backend's X-Request-Id for matching server logs.
 */
export function createHttpClient(name, config) {
  const client = axios.create({ timeout: 60000, ...config });
  if (!LOG_REQUESTS) return client;

  client.interceptors.request.use((req) => {
    req.metadata = { id: ++sequence, start: performance.now() };
    console.info(`[http:${name}] → #${req.metadata.id} ${describe(req)}`);
    return req;
  });

  client.interceptors.response.use(
    (res) => {
      const { config: req, status, headers } = res;
      const requestId = headers["x-request-id"];
      console.info(
        `%c[http:${name}] ← #${req.metadata.id} ${status} ${describe(req)} ${elapsed(req)}`,
        STATUS_STYLE.ok,
        { cache: headers["cache-control"], ...(requestId && { requestId }) },
      );
      return res;
    },
    (error) => {
      const req = error.config;
      if (req?.metadata) {
        const status = error.response?.status ?? error.code;
        const level = axios.isCancel(error) ? "info" : error.response?.status < 500 ? "warn" : "error";
        console[level](
          `%c[http:${name}] ✗ #${req.metadata.id} ${status} ${describe(req)} ${elapsed(req)}`,
          STATUS_STYLE[level === "info" ? "warn" : level],
          error.response?.data ?? error.message,
        );
      }
      return Promise.reject(error);
    },
  );

  return client;
}
