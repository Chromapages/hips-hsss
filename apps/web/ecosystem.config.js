/**
 * PM2 Ecosystem Configuration — HIPS Web (Next.js)
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 reload ecosystem.config.js
 *
 * Runtime secrets should come from the workspace root env files loaded by
 * next.config.ts, not from this PM2 process definition.
 */
module.exports = {
  apps: [
    {
      name: 'hips-web',
      script: '/bin/bash',
      args: "-lc 'set -a; source /home/deploy/hips-hsss/.env; set +a; exec node node_modules/next/dist/bin/next start -p 3000'",
      interpreter: 'none',
      cwd: '/home/deploy/hips-hsss/apps/web',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/hips-web-err.log',
      out_file: './logs/hips-web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
