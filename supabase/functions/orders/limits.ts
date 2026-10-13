export class BodyTooLarge extends Error {}
// Read incrementally so a missing or false Content-Length cannot force an unbounded allocation.
export async function readLimitedBody(
  request: Request,
  maxBytes = 32768,
): Promise<string> {
  const length = request.headers.get("content-length");
  if (length && Number(length) > maxBytes) throw new BodyTooLarge();
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        throw new BodyTooLarge();
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}
