// PM2: pm2 start ecosystem.config.cjs && pm2 save
// .env fayli avtomatik o'qiladi (node --env-file).
module.exports = {
  apps: [
    {
      name: "thermowash",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      node_args: "--env-file=.env",
      instances: 1, // in-memory rate limit uchun 1 instansiya (yetarli)
      exec_mode: "fork",
      max_memory_restart: "400M",
      env: { NODE_ENV: "production" },
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      time: true,
    },
  ],
};
