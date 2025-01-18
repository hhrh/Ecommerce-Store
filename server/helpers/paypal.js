const paypal = require('@paypal/paypal-server-sdk');

const client = new paypal.Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: paypal.Environment.Sandbox,
    logging: {
        logLevel: paypal.LogLevel.Info,
        logRequest: {
            logBody: true,
        },
        logResponse: {
            logHeaders: true,
        },
    },
});

module.exports = client;