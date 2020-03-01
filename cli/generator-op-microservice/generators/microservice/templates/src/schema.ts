import { Document, Model, model, Schema } from 'mongoose';

export const <%= serviceClassName %>Schema: Schema = new Schema({
});

interface <%= serviceClassName %>Model extends <%= typeName %> , Document { }

interface <%= serviceClassName %>ModelStatic extends Model <<%= serviceClassName %>Model> { }

export const <%= serviceClassName %>: Model<<%= serviceClassName %>Model> = model<<%= serviceClassName %>Model, <%= serviceClassName %>ModelStatic>('<%= serviceClassName%>', <%= serviceClassName %>Schema);
