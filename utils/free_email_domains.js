// Extended list of free email domains (approximately 100 domains)
// Includes global providers, country-specific services, and temporary email services
const freeDomains = [
  // Major Global Providers
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  
  // Microsoft variants
  'live.com', 'msn.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de',
  'hotmail.it', 'hotmail.es', 'outlook.co.uk', 'outlook.fr', 'outlook.de',
  
  // Yahoo variants
  'yahoo.co.uk', 'yahoo.ca', 'yahoo.com.au', 'yahoo.de', 'yahoo.fr',
  'yahoo.it', 'yahoo.es', 'yahoo.co.jp', 'yahoo.co.in', 'ymail.com',
  'rocketmail.com',
  
  // Google variants
  'googlemail.com',
  
  // Other major providers
  'fastmail.com', 'tutanota.com', 'tutamail.com', 'hushmail.com',
  'mailfence.com', 'startmail.com', 'runbox.com', 'posteo.de',
  'mailbox.org', 'ctemplar.com', 'guerrillamail.com', 'sharklasers.com',
  
  // Country-specific providers
  // Germany
  'gmx.de', 'gmx.com', 't-online.de', 'web.de', 'freenet.de',
  
  // France  
  'laposte.net', 'orange.fr', 'wanadoo.fr', 'free.fr', 'sfr.fr',
  
  // UK
  'btinternet.com', 'sky.com', 'virgin.net', 'tiscali.co.uk',
  
  // Italy
  'libero.it', 'virgilio.it', 'tiscali.it', 'alice.it',
  
  // Spain
  'terra.es', 'telefonica.net', 'ya.com',
  
  // Russia/Eastern Europe
  'yandex.ru', 'mail.ru', 'bk.ru', 'inbox.ru', 'list.ru',
  'rambler.ru', 'yandex.ua', 'ukr.net', 'bigmir.net',
  
  // China
  '163.com', '126.com', 'qq.com', 'sina.com', 'sohu.com',
  'yeah.net', 'tom.com',
  
  // Japan
  'nifty.com', 'biglobe.ne.jp', 'so-net.ne.jp',
  
  // India
  'rediffmail.com', 'sify.com', 'in.com',
  
  // Canada
  'sympatico.ca', 'rogers.com', 'bell.net',
  
  // Australia
  'bigpond.com', 'optusnet.com.au', 'bigpond.net.au',
  
  // Brazil
  'bol.com.br', 'terra.com.br', 'ig.com.br', 'uol.com.br',
  
  // Other international
  'naver.com', 'hanmail.net', 'daum.net', // South Korea
  'email.cz', 'seznam.cz', // Czech Republic
  'o2.pl', 'wp.pl', 'onet.pl', // Poland
  'centrum.cz', 'atlas.cz',
  
  // Temporary/Disposable email services
  '10minutemail.com', 'tempmail.org', 'guerrillamail.org',
  'throwaway.email', 'temp-mail.org', 'maildrop.cc',
  'mailinator.com', 'dispostable.com', 'tempail.com',
  
  // Educational (common free university domains)
  'student.com', 'edu.com',
  
  // Other notable free providers
  'inbox.com', 'email.com', 'usa.com', 'myself.com',
  'consultant.com', 'accountant.com', 'engineer.com',
  'lawyer.com', 'doctor.com', 'myself.com',
  'iname.com', 'excite.com'
];

// Export for use in your application
export default freeDomains;

// Alternative CommonJS export if using Node.js
// module.exports = freeDomains;