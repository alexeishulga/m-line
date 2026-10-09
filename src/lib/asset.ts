/**
 * URL of a file from public/, prefixed with the deploy base path
 * ("/" locally, "/m-line/" on GitHub Pages).
 */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
