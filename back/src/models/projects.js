import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
const { Schema } = mongoose;

const projects = new Schema(
  {
    _id: {
      type: String,
      default: () => String(new ObjectId()),
    },
    name: String,
    politic: String,
  },
  { versionKey: false },
);

module.exports = mongoose.model('projects', projects, 'projects');
