Installed posthog-js with npm.
│
◇  Installed posthog-node with npm.
│
◇  What router are you using?
│  app router
│
●  Reviewing PostHog documentation for app router
│
◇  Found 4 files to change
│
◇  Created file components/PostHogProvider.tsx
│
◇  Created file lib/posthog.ts
│
◇  Updated file next.config.ts
│
◇  Updated file app/layout.tsx
│
◆  Updated environment variables in .env.local
│
◆  Updated .gitignore to include .env.local.
│
◇  Prettier has formatted your files.
│
└
Successfully installed PostHog!

Changes made:
• Installed posthog-js & posthog-node packages
• Initialized PostHog, and added pageview tracking
• Created a PostHogClient to use PostHog server-side
• Setup a reverse proxy to avoid ad blockers blocking analytics requests
• Added your Project API key to your .env.local file

Next steps:
• Call posthog.identify() when a user signs into your app
• Call posthog.capture() to capture custom events in your app
• Upload environment variables to your production environment

Learn more about PostHog + Next.js: https://posthog.com/docs/libraries/next-js
