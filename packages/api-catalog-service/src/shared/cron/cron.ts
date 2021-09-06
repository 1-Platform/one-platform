import { SendMailOptions } from 'nodemailer';
import { Namespace } from '../../namespace/schema';
import { updateEmailConfig } from '../emails/update-email-config';

import { apiCatalogHelper } from '../helpers';

export async function checkAPIHash () {
    const namespaces: NamespaceType[] = await Namespace.find().lean();
    namespaces.map( ( namespace: any ) => {
        const category = namespace.category as ApiCategory;
        namespace.environments?.map( async ( environment: EnvironmentType ) => {
            environment.lastCheckedOn = new Date();
            const hash = await apiCatalogHelper.manageApiHash( category, environment );
            if ( hash === environment.hash ) {
                console.info( '\x1b[35m', `No API updates for ${ namespace.name } ${ environment.name } environment\n` );
            } else if ( hash !== environment.hash ) {
                console.info( '\x1b[31m', `Active API updates for ${ namespace.name } ${ environment.name } environment\n` );
                const emailConfig: SendMailOptions = await updateEmailConfig( namespace, environment );
                apiCatalogHelper.emailConfig().sendMail( emailConfig );
            }
            Namespace.findByIdAndUpdate( namespace._id, namespace, { new: true } ).exec().then( () => {
                console.info( '\x1b[32m', `Database Updated Successfully for for ${ namespace.name } ${ environment.name } environment` );
            } );
        } );
    } );
}
