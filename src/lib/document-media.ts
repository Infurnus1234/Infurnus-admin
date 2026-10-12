export const documentLimit = 15 * 1024 * 1024;
export function documentStorageUrl(
  value: string,
  localOrigin?: string,
  production = true,
) {
  const url = new URL(value);
  if (url.username || url.password) throw Error("Unsupported document storage");
  if (
    url.protocol === "https:" &&
    url.hostname === "res.cloudinary.com" &&
    !url.port
  )
    return url.href;
  if (
    !production &&
    localOrigin &&
    url.origin === localOrigin &&
    ["127.0.0.1", "localhost"].includes(url.hostname) &&
    ["http:", "https:"].includes(url.protocol)
  )
    return url.href;
  throw Error("Unsupported document storage");
}
export function documentMime(value: string) {
  const mime = value.split(";")[0].trim().toLowerCase();
  if (
    ![
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "application/pdf",
    ].includes(mime)
  )
    throw Error("Unsupported document format");
  return mime;
}
export async function readDocument(response: Response) {
  if (!response.ok || !response.body)
    throw Error("Stored document unavailable");
  const type = documentMime(response.headers.get("content-type") || "");
  if (Number(response.headers.get("content-length")) > documentLimit)
    throw Error("Document exceeds preview limit");
  const reader = response.body.getReader();
  let length = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > documentLimit) throw Error("Document exceeds preview limit");
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel();
    throw error;
  }
  const data = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  const head = new TextDecoder("ascii").decode(data.slice(0, 12));
  const valid =
    type === "application/pdf"
      ? head.startsWith("%PDF-")
      : type === "image/png"
        ? data
            .slice(0, 8)
            .every((v, i) => v === [137, 80, 78, 71, 13, 10, 26, 10][i]) &&
          length > 8
        : type === "image/jpeg"
          ? data[0] === 255 && data[1] === 216 && data[2] === 255
          : type === "image/gif"
            ? /^GIF8[79]a/.test(head)
            : head.startsWith("RIFF") && head.slice(8) === "WEBP";
  if (!valid) throw Error("Stored file does not match its declared format");
  return { data: data.buffer, type };
}
