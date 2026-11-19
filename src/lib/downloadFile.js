export function downloadTextFile(filename, content, mime = "text/markdown;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function fileBase(name, fallback = "IdeaSpark") {
  const base = (name || fallback).replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "");
  return base || fallback;
}