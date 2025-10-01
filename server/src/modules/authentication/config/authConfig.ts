export const authConfig = {
  accessTokenExpiresIn: 3600, // 1 hour
  refreshTokenExpiresIn: 604800, // 7 days
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  saltRounds: parseInt(process.env.saltRounds || "10", 10),
};
