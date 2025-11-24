// TODO: 計算量の考慮が雑
const pages = Object.fromEntries(
  Object.entries(import.meta.glob('../pages/**/*.astro', { eager: true }))
    .map(([key, value]) => [key.replace(/^\.\.\/pages\//, '/').replace(/index\.astro$/, ''), value])
);

function getPageInfo(path: string) {
  const text = path
    .split('/')
    .filter(Boolean)
    .map(part => part.replace(/-/g, ' '))
    .join('/');

  return { href: path, text };
}

export const getPages = (path: RegExp) => {
  return Object.keys(pages)
    .filter(p => path.test(p))
    .map(p => getPageInfo(p));
};
