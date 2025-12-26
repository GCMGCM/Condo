/** Root Next.js config - instruct Turbopack to treat the saas-site folder as the workspace root.
 * This resolves Next's "Couldn't find any `pages` or `app` directory" when there are multiple lockfiles
 * and Turbopack infers the workspace root incorrectly.
 */
module.exports = {
  turbopack: {
    root: './saas-site'
  }
};
