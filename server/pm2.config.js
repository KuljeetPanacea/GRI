module.exports = {
  apps: [
    {
      name: "pi-audit-app",
      script: "npm",
      args: "start",
      cwd: "/home/ubuntu/server",
      env: {
        NODE_ENV: "production",
        PORT: 8000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "12G"
    }
  ]
};
