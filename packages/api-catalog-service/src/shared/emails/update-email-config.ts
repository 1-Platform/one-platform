import { SPA_URL } from '../../setup/env';

export async function updateEmailConfig ( namespace: NamespaceType, environment: NSEnvironmentType ) {

    const message = `
Hi,<br/><br/>

There are new updates for ${ namespace.name } APIs in ${ environment.name } environment.<br/>
Please visit <a href="${ SPA_URL }/details/${ namespace.slug }" target="_blank">API Catalog</a> for more information.


<p style="color:#989898"><b>Note:</b>You are receiving this mail because you have subscribed to API Catalog.</p>
`;
    const emailConfig: any = {
        from: 'One Platform | API Catalog<no-reply@redhat.com>',
        bcc: environment.subscribers?.map( subscriber => subscriber?.email )?.toString(),
        subject: `API updates available for ${ namespace.name } in ${ environment.name } environment`,
        html: message
    };
    return emailConfig;
}
