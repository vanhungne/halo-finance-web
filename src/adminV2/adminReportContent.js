// Report offsets count PostgreSQL Unicode characters, not UTF-16 code units.
export const ADMIN_REPORT_PAGE_SIZE = 4000;

export function verifyAdminReportContentPage(page, reportId, version, contentLength, offset) {
  if (!reportId || typeof version !== "string" || !/^[1-9]\d*$/.test(version)
      || !Number.isSafeInteger(contentLength) || contentLength < 0
      || !Number.isSafeInteger(offset) || offset < 0 || offset > contentLength
      || page?.reportId !== reportId || page.version !== version || page.offset !== offset
      || page.contentLength !== contentLength || typeof page.content !== "string") {
    throw new Error("Report content changed. Reload the dossier.");
  }
  const end = Math.min(offset + ADMIN_REPORT_PAGE_SIZE, contentLength);
  if ([...page.content].length !== end - offset || page.nextOffset !== (end < contentLength ? end : null)) {
    throw new Error("Report content is incomplete or its continuation is invalid.");
  }
  return page;
}

export function inspectAdminReportContent(pages, reportId, version, contentLength) {
  if (!Array.isArray(pages)) throw new Error("Report pages are unavailable.");
  let offset = 0; let complete = false; const chunks = [];
  for (const page of pages) {
    if (complete) throw new Error("Report content continues after its terminal page.");
    verifyAdminReportContentPage(page, reportId, version, contentLength, offset);
    chunks.push(page.content);
    complete = page.nextOffset === null;
    offset = page.nextOffset ?? contentLength;
  }
  return { content: chunks.join(""), complete };
}
