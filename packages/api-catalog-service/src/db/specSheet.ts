import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';
import { decrypt, encrypt } from 'utils';
import { isAlreadyEncrypted } from 'utils/encryption';

export const SpecSheetSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    appURL: {
      type: String,
      required: true,
    },
    docURL: {
      type: String,
    },
    lastCheckedOn: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ['REST', 'GRAPHQL'],
      required: true,
    },
    flags: {
      isInternal: {
        type: Boolean,
        default: false,
      },
      isDeprecated: {
        type: Boolean,
        default: false,
      },
    },
    environments: [
      {
        name: {
          type: String,
          required: true,
        },
        slug: {
          type: String,
          unique: true,
          default: () => nanoid(6),
        },
        apiBasePath: {
          type: String,
          required: true,
        },
        flags: {
          isPublic: {
            type: Boolean,
            default: false,
          },
        },
        schemaEndpoint: {
          type: String,
        },
        hash: {
          type: String,
        },
        headers: [
          {
            key: {
              type: String,
              required: true,
            },
            value: {
              type: String,
              required: true,
              get: (data: string) => {
                if (data === null || typeof data === 'undefined') {
                  return data;
                }
                return decrypt(process.env.NAMESPACE_ENCRYPTION_KEY as string, data);
              },
              set: (data: string) => {
                if (data === null || typeof data === 'undefined' || isAlreadyEncrypted(data)) {
                  return data;
                }
                return encrypt(process.env.NAMESPACE_ENCRYPTION_KEY as string, data);
              },
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' },
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);
