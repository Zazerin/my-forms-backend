export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  googleApi: {
    account: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
});
