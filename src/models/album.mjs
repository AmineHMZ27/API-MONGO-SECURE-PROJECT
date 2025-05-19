import mongoose, { Schema } from 'mongoose';

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
  create_at: { type: Date, default: Date.now }
}, {
  collection: 'albums',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    const retUpdated = ret;
    retUpdated.id = ret._id;
    delete retUpdated._id;
    return retUpdated;
  }
});

export default AlbumSchema;
