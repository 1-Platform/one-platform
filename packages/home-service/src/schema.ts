import { Document, Model, model, Schema } from 'mongoose';

export const HomeSchema: Schema = new Schema({
});

interface HomeModel extends HomeType , Document { }

interface HomeModelStatic extends Model <HomeModel> { }

export const Home: Model<HomeModel> = model<HomeModel, HomeModelStatic>('Home', HomeSchema);
