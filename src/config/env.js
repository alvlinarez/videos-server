require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  CLIENT_URL,
  DB_MONGO,
  JWT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SENDGRID_API_KEY,
  JWT_ACCOUNT_ACTIVATION,
  EMAIL_TO,
  EMAIL_FROM,
  JWT_RESET_PASSWORD
} = process.env;

module.exports = {
  env: NODE_ENV,
  port: PORT,
  clientUrl: CLIENT_URL,
  dbMongo: DB_MONGO,
  jwtSecret: JWT_SECRET,
  sendGridApiKey: SENDGRID_API_KEY,
  jwtAccountActivation: JWT_ACCOUNT_ACTIVATION,
  emailTo: EMAIL_TO,
  emailFrom: EMAIL_FROM,
  jwtResetPass: JWT_RESET_PASSWORD,
  facebookClientId: FACEBOOK_CLIENT_ID,
  facebookClientSecret: FACEBOOK_CLIENT_SECRET,
  googleClientId: GOOGLE_CLIENT_ID,
  googleClientSecret: GOOGLE_CLIENT_SECRET
};
