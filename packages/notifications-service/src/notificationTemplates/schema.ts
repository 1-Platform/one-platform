import { CallbackError, Document, model, Model, Schema } from 'mongoose';
import { randomBytes } from 'crypto';

export interface TemplateModel extends NotificationTemplate, Document { }

interface TemplateModelStatic extends Model<TemplateModel> { }

const NotificationTemplateSchema = new Schema<NotificationTemplate>( {
  name: { type: String, unique: true },
  description: { type: String },
  subject: { type: String },
  body: { type: String },
  templateEngine: {
    type: String,
    enum: [ TemplateEngine.TWIG, TemplateEngine.HBS, TemplateEngine.NJK ],
    default: TemplateEngine.TWIG,
  },
  dataMap: [ {
    key: String,
    value: String,
  } ],
  templateType: {
    type: String,
    enum: [ TemplateType.EMAIL, TemplateType.BANNER, TemplateType.PUSH ],
    default: TemplateType.EMAIL,
  },
  owners: { type: [String] },
  isEnabled: { type: Boolean, default: true },

  templateID: { type: String, unique: true },

  createdOn: { type: Date, default: Date.now },
  createdBy: { type: String },
  updatedOn: { type: Date, default: Date.now },
  updatedBy: { type: String },
} );

/* Generate a random hex id for templateID */
NotificationTemplateSchema.post( 'save', async ( doc: TemplateModel, next ) => {
  if ( !doc.templateID ) {
    let retryCount = 0;
    while (true) {
      retryCount += 1;
      try {
        doc.templateID = randomBytes( 5 ).toString( 'hex' );
        await doc.save();
      } catch ( err ) {
        if ( retryCount < 5 ) {
          continue;
        }
        next( err as CallbackError );
      }
      break;
    }
  }
  next();
} );

export const NotificationTemplate = model<TemplateModel, TemplateModelStatic>( 'NotificationTemplate', NotificationTemplateSchema );
