import * as yup from 'yup';
import { emailErrorMsg, reqErrorMsg } from 'utils';
import { ApiCategory, ApiEmailGroup } from 'api/types';

export const wizardStepDetails = [
  {
    title: 'Basic Details',
  },
  {
    title: 'API Schema(s)',
  },
  {
    title: 'Review',
  },
];

export const GET_USERS_QUERY = /* GraphQL */ `
  query ($search: String!) {
    searchRoverUsers(ldapfield: uid, value: $search) {
      mail
      cn
      rhatUUID
    }
  }
`;

export const GET_API_SCHEMA_FILE = /* GraphQL */ `
  query FetchAPISchema($config: FetchApiSchemaInput, $envSlug: String) {
    fetchAPISchema(config: $config, envSlug: $envSlug) {
      schema {
        name
        id
      }
      file
    }
  }
`;

const step1Schema = {
  id: yup.string().notRequired(),
  name: yup.string().trim().required(reqErrorMsg('Name')),
  description: yup.string().trim().required(reqErrorMsg('Description')),
  slug: yup.string().notRequired(),
  owners: yup
    .array(
      yup
        .object({
          group: yup.mixed<ApiEmailGroup>().oneOf(Object.values(ApiEmailGroup)).required(),
          mid: yup
            .string()
            .when('group', {
              is: (value: string) => value === ApiEmailGroup.MAILING_LIST,
              then: yup.string().email(emailErrorMsg(`Owner's mailing list`)).trim().required(),
              otherwise: yup.string().trim().required(),
            })
            .required(reqErrorMsg('Mid')),
          email: yup.string().trim().required(),
        })
        .required(reqErrorMsg('Owners'))
    )
    .required(reqErrorMsg('Owners'))
    .min(1, 'Minimum one owner required'),
};

const step2Schema = {
  schemas: yup
    .array(
      yup
        .object({
          id: yup.string().notRequired(),
          name: yup.string().trim().required(reqErrorMsg('Schema name')),
          description: yup.string().trim().required(reqErrorMsg('Schema description')),
          appURL: yup.string().url().trim().required(reqErrorMsg('Application URL')),
          docURL: yup.string().url().trim(),
          flags: yup.object({
            isInternal: yup.bool().default(false),
            isDeprecated: yup.bool().default(false),
          }),
          category: yup
            .mixed<ApiCategory>()
            .oneOf(Object.values(ApiCategory))
            .required(reqErrorMsg('API Category')),
          environments: yup
            .array(
              yup.object({
                id: yup.string().notRequired(),
                name: yup.string().trim().required(reqErrorMsg('Name')),
                slug: yup.string().notRequired(),
                apiBasePath: yup.string().url().trim().required(reqErrorMsg('API Base Path')),
                schemaEndpoint: yup.string().url().trim(),
                headers: yup.array(
                  yup.object({
                    id: yup.string().notRequired(),
                    key: yup.string().trim(),
                    value: yup.string().trim(),
                  })
                ),
                isPublic: yup.bool(),
              })
            )
            .required(reqErrorMsg('Environments')),
        })
        .required(reqErrorMsg('Schema'))
    )
    .min(1)
    .required(reqErrorMsg('Schema')),
};

export const wizardValidationSchemas = {
  1: yup.object(step1Schema),
  2: yup.object(step2Schema),
  3: yup.object({ ...step1Schema, ...step2Schema }),
};
