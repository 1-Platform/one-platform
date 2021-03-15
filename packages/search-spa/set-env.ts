const fs = require('fs');

const writeFile = fs.writeFile;

const targetPath = './src/environments/environment.ts';

require('dotenv').config();

const envConfigFile = `export const environment = {
   API_URL: '${process.env.API_URL}',
   production: process.env.NODE_ENV === 'production',
};
`;
console.log('The file `environment.ts` will be written with the following content: \n');
writeFile(targetPath, envConfigFile, (err) => {
   if (err) {
       throw console.error(err);
   } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
   }
});
