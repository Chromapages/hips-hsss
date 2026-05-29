/**
 * PM2 Ecosystem Configuration — HIPS Backend Services
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 stop ecosystem.config.js
 *   pm2 restart ecosystem.config.js
 *
 * Each service is a separate process for independent scaling/failure isolation.
 */
module.exports = {
  apps: [
    {
      name: 'hips-session',
      script: 'dist/main.js',
      cwd: './services/session',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: './logs/hips-session-err.log',
      out_file: './logs/hips-session-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
    {
      name: 'hips-vault',
      script: 'dist/main.js',
      cwd: './services/vault',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      error_file: './logs/hips-vault-err.log',
      out_file: './logs/hips-vault-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
    {
      name: 'hips-safety',
      script: 'dist/main.js',
      cwd: './services/safety',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: './logs/hips-safety-err.log',
      out_file: './logs/hips-safety-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
    {
      name: 'hips-commerce',
      script: 'dist/main.js',
      cwd: './services/commerce',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: './logs/hips-commerce-err.log',
      out_file: './logs/hips-commerce-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
