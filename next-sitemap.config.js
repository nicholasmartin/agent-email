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
  // Don't exclude anything here - we'll handle exclusions in the transform function
  exclude: [],
  // We don't need additionalPaths anymore as we'll handle all paths in transform
  generateIndexSitemap: false,
  outDir: 'public',
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // Exclude private routes and assets
    if (path.startsWith('/dashboard') || 
        path.startsWith('/auth') || 
        path.startsWith('/api/') ||
        path === '/404' ||
        path === '/500' ||
        path.match(/\.(png|jpg|jpeg|svg|ico|js|css)$/)) {
      return null; // Exclude this path
    }
    
    // Clean up route group prefixes if they appear in the path
    let cleanPath = path;
    
    // Handle route groups by removing them from the path
    if (cleanPath.includes('(public)')) {
      cleanPath = cleanPath.replace(/\(public\)\/?/g, '');
    }
    if (cleanPath.includes('(protected)')) {
      return null; // Exclude protected routes
    }
    if (cleanPath.includes('(auth-pages)')) {
      return null; // Exclude auth pages
    }
    
    // Set priorities based on path
    let priority = config.priority;
    let changefreq = config.changefreq;
    
    if (cleanPath === '/' || cleanPath === '') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (cleanPath.startsWith('/api')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (cleanPath.startsWith('/blog/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else {
      // All other content pages
      priority = 0.7;
      changefreq = 'weekly';
    }
    
    return {
      loc: cleanPath,
      changefreq: changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
    };
  },
}
