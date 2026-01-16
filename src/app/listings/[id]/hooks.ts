export function getStoragePathFromPublicUrl(publicUrl: string) {
  const marker = "/listing-images/";
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return publicUrl.slice(index + marker.length);
}