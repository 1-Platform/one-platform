/* eslint-disable no-underscore-dangle */
import { SPA_URL } from '../../setup/env';

export default async function updateEmailConfig(namespace: Omit<NamespaceType, 'owners'>) {
  const message = `
Hi,<br/><br/>

There are new updates for ${namespace.name} APIs.
<br/>
Please visit <a href="${SPA_URL}/apis/${(namespace as any)._id}" target="_blank">API Catalog</a> for more information.


<p style="color:#989898"><b>Note:</b>You are receiving this mail because you have subscribed to API Catalog.</p>
`;
  const emailConfig: any = {
    from: 'One Platform | API Catalog<no-reply@redhat.com>',
    bcc: namespace.subscribers?.map((subscriber) => subscriber?.email)?.toString(),
    subject: `API updates available for ${namespace.name}.`,
    html: message,
  };
  return emailConfig;
}
