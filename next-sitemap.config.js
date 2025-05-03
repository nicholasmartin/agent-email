/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://agent-email.magloft.com', // Replace with your actual domain
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/auth/', '/api/'],
      },
    ],
  },
  // Explicitly exclude asset files and private routes
  exclude: [
    '/*.png',
    '/*.jpg',
    '/*.jpeg',
    '/*.svg',
    '/*.ico',
    '/*.js',
    '/*.css',
    '/dashboard*',
    '/auth*',
    '/api/*',
    '/404',
    '/500'
  ],
  // Explicitly add the routes we know should be in the sitemap
  additionalPaths: async (config) => {
    return [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/api',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      // Add any other known routes here
      // For example, if you create an /ai-email page:
      // {
      //   loc: '/ai-email',
      //   changefreq: 'weekly',
      //   priority: 0.8,
      //   lastmod: new Date().toISOString(),
      // },
    ];
  },
  generateIndexSitemap: false,
  outDir: 'public',
  changefreq: 'weekly',
  priority: 0.7,
}
