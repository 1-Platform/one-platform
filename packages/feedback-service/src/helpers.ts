// write your helper functions here
import { RedisPubSub } from 'graphql-redis-subscriptions';
export const pubsub = new RedisPubSub();
const nodemailer = require("nodemailer");

export const getTransporter =  nodemailer.createTransport({
    host: "smtp.corp.redhat.com",
    port: 587,
    secure: false,
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    },
    logger: true,
    debug: false // include SMTP traffic in the logs
  });
