import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
const { Schema } = mongoose;

const tasks = new Schema(
  {
    _id: {
      type: String,
      default: () => String(new ObjectId()),
    },
    projectId: String,
    name: String,
    status: String,
  },
  { versionKey: false,  strict: false  },
);

module.exports = mongoose.model('tasks', tasks, 'tasks');
