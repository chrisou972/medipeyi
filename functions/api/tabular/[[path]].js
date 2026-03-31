const UPSTREAM_BASE = "https://tabular-api.data.gouv.fr/api";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const upstreamPath = url.pathname.replace(/^\/api\/tabular/, "");
  const upstreamUrl = `${UPSTREAM_BASE}${upstreamPath}${url.search}`;

  const response = await fetch(upstreamUrl, {
    headers: {
      Accept: context.request.headers.get("Accept") || "application/json",
    },
  });

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", headers.get("Cache-Control") || "public, max-age=300");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
