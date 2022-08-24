module.exports = {
  apps: [
    {
      script: './dist/main.js',
      name: 'nestjs_online_store',
      exec_mode: 'cluster',
      instances: 'max',
      log_date_format: 'YYYY-MM-DD HH:mm',
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
