import { Document, Model, model, Schema } from 'mongoose';

export const HomeServiceSchema: Schema = new Schema({
    name: { type: String, index: { unique: true } },
    description: { type: String },
    link: { type: String },
    icon: { type: String },
    entityType: { type: String },
    colorScheme: { type: String },
    videoUrl: { type: String },
    owners: { type: [String] },
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now, },
    updatedBy: { type: String },
    updatedOn: { type: Date, default: Date.now, },
    active: { type: Boolean, default: false },
    applicationType: {
        type: String,
        enum: [
            'BUILTIN',
            'HOSTED'
        ],
        required: true,
    },
    contacts: {
        developers: [ String ],
        qe: [ String ],
        stakeholders: [ String ],
    },
    permissions: [
        {
            roverGroup: String,
            role: {
                type: String,
                enum: ['ADMIN', 'USER'],
                required: true,
            }
        }
    ],
    feedback: {
        source: { type: String, enum: [ 'JIRA', 'GITHUB', 'GITLAB' ] },
        sourceUrl: { type: String },
        isActive: { type: Boolean },
        projectKey: { type: String },
    },
});

interface HomeModel extends HomeType , Document { }

interface HomeModelStatic extends Model <HomeModel> { }

export const Home: Model<HomeModel> = model<HomeModel, HomeModelStatic>('Home', HomeServiceSchema);
