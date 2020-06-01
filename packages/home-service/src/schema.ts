import { Document, Model, model, Schema } from 'mongoose';

export const HomeServiceSchema: Schema = new Schema({
    name: String,
    description: String,
    link: String,
    icon: String,
    entityType: String,
    colorScheme: String,
    videoUrl: String,
    owners: [String],
    createdBy: String,
    createdOn: Date,
    updatedBy: String,
    updatedOn: Date,
    permissions: [
        {
            roverGroup: String,
            role: String,
        }
    ],
});

interface HomeModel extends HomeType , Document { }

interface HomeModelStatic extends Model <HomeModel> { }

export const Home: Model<HomeModel> = model<HomeModel, HomeModelStatic>('Home', HomeServiceSchema);
