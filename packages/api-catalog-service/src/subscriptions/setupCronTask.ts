/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
import Agenda, { Job } from 'agenda';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { Logger } from 'pino';
import { decrypt } from 'utils';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { fetchSchema } from 'specsheet';
import { Namespace } from 'db/namespace';
import { SpecStore } from 'db/specStore';
import { IApiCategory } from 'db/types';

import { Jobs } from './types';
import { diffGraphql } from './diffGraphql';
import { diffOpenAPI } from './diffOpenAPI';
import { getSubscribersOfAnEnv, saveSpecSheet } from './subscriptionDAL';

type Config = {
  decryptionKey: string;
};

const restApiTemplateSource = fs.readFileSync(
  path.join(__dirname, '/templates/rest-api-changes.hbs'),
  'utf8',
);

const gqlApiTemplateSource = fs.readFileSync(
  path.join(__dirname, '/templates/gql-api-changes.hbs'),
  'utf8',
);

const restApiTemplate = Handlebars.compile(restApiTemplateSource);
const gqlApiTemplate = Handlebars.compile(gqlApiTemplateSource);

export const setupCronTask = (
  jobs: Agenda,
  logger: Logger,
  config: Config,
  mailer: Transporter<SMTPTransport.SentMessageInfo>,
) => {
  /**
   * This is the parent task which runs exactly 12am
   * It goes through all env and spin up another queue called child with required data
   */
  jobs.define(Jobs.SUBSCRIPTION_PARENT, { concurrency: 1 }, async () => {
    logger.info('Cron task for subscriptions started');

    const totalNamespace = await Namespace.count();
    const perDoc = 20;
    const numberOfCycles = Math.ceil(totalNamespace / perDoc);

    for (let i = 1; i <= numberOfCycles; i += 1) {
      const nsDocs = await Namespace.find()
        .sort([['createdOn', -1]])
        .limit(perDoc)
        .skip(perDoc * (i - 1))
        .lean();
      nsDocs.forEach((doc) => {
        doc.schemas.forEach((schema) => {
          if (schema.flags.isDeprecated) return;

          schema.environments.forEach((env) => {
            if (!env.schemaEndpoint) {
              return;
            }

            jobs.now(Jobs.SUBSCRIPTION_CHILD, {
              namespace: { id: doc._id, name: doc.name },
              schema: { id: schema._id, name: schema.name, category: schema.category },
              env,
            });
          });
        });
      });
    }

    logger.info('Cron task for subscriptions ended');
  });

  /**
   * Child process that handles diff finding and mailing
   */
  jobs.define(Jobs.SUBSCRIPTION_CHILD, { concurrency: 10 }, async (job: Job) => {
    logger.info(`triggered job: ${job.attrs._id}`);
    const { data } = job.attrs;

    if (!data) return;

    const { namespace, schema, env } = data;
    const subLog = logger.child({
      namespace: namespace.id,
      schema: schema.id,
      envId: env._id,
      name: env.name,
    });
    const headers = env?.headers?.map(({ key, value }: { key: string; value: string }) => ({
      key,
      value: decrypt(config.decryptionKey, value),
    }));

    const res = await fetchSchema(data.schema.category, env.schemaEndpoint, headers);

    const resBase64 = Buffer.from(res).toString('base64');

    const store = await SpecStore.findOne({
      namespaceId: namespace.id,
      schemaId: schema.id,
      environmentId: env._id,
    })
      .sort([['createdOn', -1]])
      .lean();

    /**
     * Spec is not added, therefore not needed to do any furthur process
     * Just store it
     */
    if (!store) {
      subLog.info('API not added yet');
      await saveSpecSheet(namespace.id, schema.id, env._id, resBase64);
      return;
    }

    const oldSpec = Buffer.from(store.spec, 'base64').toString();

    /**
     * Check for graphql API
     * Using inspector compare two schemas
     * If there is a change store new schema
     * Send mail with new changes denoted
     */
    if (data.schema.category === IApiCategory.Graphql) {
      try {
        const gqlDiff = await diffGraphql(oldSpec, res);

        if (!gqlDiff.hasChanged) {
          subLog.info('GQL API not changed');
          return;
        }

        subLog.info('GQL API changed');
        await saveSpecSheet(namespace.id, schema.id, env._id, resBase64);

        const subscribers = await getSubscribersOfAnEnv(namespace.id, schema.id, env._id);
        if (!subscribers.length) {
          subLog.info('No subscribers found!!!');
          return;
        }

        await mailer.sendMail({
          from: 'One Platform | API Catalog<no-reply@redhat.com>',
          to: subscribers.map((el) => el.subscriberEmail),
          subject: `API updates for ${env.name.toUpperCase()} environment of
            ${schema.name.toUpperCase()} in ${namespace.name.toUpperCase()} namespace`,
          html: gqlApiTemplate({
            ...gqlDiff,
            namespace: namespace.name,
            schema: schema.name,
            environment: env.name,
          }),
        });

        subLog.info('Mail send to subscribers');
      } catch (error) {
        subLog.error(error?.message);
      }
      return;
    }

    /**
     * Else case: REST API
     * Check for openapi difference
     * Send mail to subscribers of any change classified into breaking and non breaking
     */
    try {
      const diff = await diffOpenAPI(oldSpec, res);

      if (!diff.hasChanged) {
        subLog.info({ name: env.name }, 'Rest API not changed');
        return;
      }

      subLog.info('REST API changed');

      await saveSpecSheet(namespace.id, schema.id, env._id, resBase64);
      const subscribers = await getSubscribersOfAnEnv(namespace.id, schema.id, env._id);
      if (!subscribers.length) {
        subLog.info('No subscribers found!!!');
        return;
      }

      await mailer.sendMail({
        from: 'One Platform | API Catalog<no-reply@redhat.com>',
        to: subscribers.map((el) => el.subscriberEmail),
        subject: `API updates for ${env.name.toUpperCase()} environment of
            ${schema.name.toUpperCase()} in ${namespace.name.toUpperCase()} namespace`, // Subject line
        html: restApiTemplate({
          ...diff,
          namespace: namespace.name,
          schema: schema.name,
          environment: env.name,
        }),
      });
      subLog.info('Mail send');
    } catch (error) {
      subLog.error(error);
    }
  });

  jobs.on(`fail:${Jobs.SUBSCRIPTION_CHILD}`, (err, job: Job) => {
    logger.error(`Failed to execute job: ${job.attrs._id}`);
    logger.error(job.attrs.data?.env?.name);
    logger.error(err);
  });

  jobs.start();
  jobs.on('ready', async () => {
    await jobs.every('0 1 * * *', Jobs.SUBSCRIPTION_PARENT);
  });
};
