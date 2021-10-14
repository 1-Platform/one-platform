import { SendMailOptions } from 'nodemailer';
import { Namespace } from '../../namespace/schema';
import updateEmailConfig from '../emails/update-email-config';

import APICatalogHelper from '../helpers';

const checkAPIHash = async function checkAPIHash() {
  const namespaces: NamespaceType[] = await Namespace.find().lean();
  namespaces.map(async (namespace: NamespaceType) => {
    const nsRecord = namespace;
    nsRecord.lastCheckedOn = new Date();
    const hash = await APICatalogHelper.manageApiHash(nsRecord);
    if (hash === nsRecord.hash) {
      process.stdout.write(`No API updates for ${nsRecord.name}\n`);
    } else if (hash !== nsRecord.hash) {
      process.stdout.write(`Active API updates for ${nsRecord.name}\n`);
      const emailConfig: SendMailOptions = await updateEmailConfig(nsRecord);
      APICatalogHelper.emailConfig().sendMail(emailConfig);
    }
    nsRecord.hash = hash as string;
    await Namespace.findByIdAndUpdate((nsRecord as any).id, nsRecord,
      { new: true }).exec().then(() => {
      process.stdout.write(`Database Updated Successfully for ${nsRecord.name} APIs\n`);
    });
  });
};

export { checkAPIHash as default };
