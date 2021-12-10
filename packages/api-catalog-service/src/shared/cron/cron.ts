import { SendMailOptions } from 'nodemailer';
import { Namespace } from '../../namespace/schema';
import updateEmailConfig from '../emails/update-email-config';

import APICatalogHelper from '../helpers';
import Logger from '../../lib/logger';

const checkAPIHash = async function checkAPIHash() {
  const namespaces: NamespaceDoc[] = await Namespace.find().exec();
  namespaces.forEach(async (namespace: NamespaceDoc) => {
    const nsRecord = namespace;
    nsRecord.lastCheckedOn = new Date();
    const hash = await APICatalogHelper.manageApiHash(nsRecord);
    if (hash === nsRecord.hash) {
      Logger.info(`No API updates for ${nsRecord.name}\n`);
    } else if (hash !== nsRecord.hash) {
      Logger.info(`Active API updates for ${nsRecord.name}\n`);
      const emailConfig: SendMailOptions = await updateEmailConfig(nsRecord);
      APICatalogHelper.emailConfig().sendMail(emailConfig);
    }
    nsRecord.hash = hash as string;
    await Namespace.findByIdAndUpdate((nsRecord as any).id, nsRecord,
      { new: true }).exec().then(() => {
      Logger.info(`Database Updated Successfully for ${nsRecord.name} APIs\n`);
    });
  });
};

export { checkAPIHash as default };
