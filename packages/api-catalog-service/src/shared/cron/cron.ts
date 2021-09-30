import { SendMailOptions } from "nodemailer";
import { Namespace } from "../../namespace/schema";
import { updateEmailConfig } from "../emails/update-email-config";

import { apiCatalogHelper } from "../helpers";

export async function checkAPIHash() {
  const namespaces: NamespaceType[] = await Namespace.find().lean();
  namespaces.map(async (namespace: NamespaceType) => {
    namespace.lastCheckedOn = new Date();
    const hash = await apiCatalogHelper.manageApiHash(namespace);
    if (hash === namespace.hash) {
      console.info("\x1b[35m", `No API updates for ${namespace.name}\n`);
    } else if (hash !== namespace.hash) {
      console.info("\x1b[31m", `Active API updates for ${namespace.name}\n`);
      const emailConfig: SendMailOptions = await updateEmailConfig(namespace);
      apiCatalogHelper.emailConfig().sendMail(emailConfig);
    }
    namespace.hash = hash;
    await Namespace.findByIdAndUpdate((namespace as any).id, namespace, {
      new: true,
    })
      .exec()
      .then(() => {
        console.info(
          "\x1b[32m",
          `Database Updated Successfully for ${namespace.name} APIs`
        );
      });
  });
}
