// HTML is supplied only by the protected policy preview, never an editor draft.
export function adminBlogPreviewDocument(html, tokens = {}) {
  const css = Object.entries(tokens).map(([name, value]) => `--admin-${name}:${value};`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'"><meta name="referrer" content="no-referrer"><style>:root{${css}}body{background:var(--admin-surface);color:var(--admin-text);font-family:var(--admin-font-sans);font-size:var(--admin-text-body);line-height:1.6;padding:var(--admin-space-3);overflow-wrap:anywhere}img{display:none}a{pointer-events:none}pre{white-space:pre-wrap}</style></head><body>${html}</body></html>`;
}

export async function collectAdminBlogSource(blogId, version, field, length, fetchPage, signal) {
  if (!/^[1-9]\d*$/.test(version) || !["html", "json"].includes(field) || !Number.isSafeInteger(length)
      || length < 0 || length > (field === "html" ? 250000 : 1000000)) throw new Error("Content requires review before editing.");
  const chunks = []; let offset = 0;
  do {
    const page = await fetchPage(blogId, { Field: field, Offset: offset, Limit: 10000, ExpectedVersion: version }, { signal });
    if (page.blogId !== blogId || page.version !== version || page.field !== field || page.offset !== offset || page.contentLength !== length
        || typeof page.content !== "string" || [...page.content].length !== Math.min(10000, length - offset)) throw new Error("Content changed or the source page is incomplete.");
    chunks.push(page.content); offset += [...page.content].length;
    if (page.nextOffset !== (offset < length ? offset : null)) throw new Error("Invalid source continuation.");
  } while (offset < length);
  return chunks.join("");
}
