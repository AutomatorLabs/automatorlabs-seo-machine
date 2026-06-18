export function createProgrammaticCanonicalPath(
  clusterPath: string,
  slug: string,
): string {
  const normalizedClusterPath = clusterPath.replace(/^\/+|\/+$/g, '');
  return `/${normalizedClusterPath}/${slug}/`;
}
