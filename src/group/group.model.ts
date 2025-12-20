import mongoose, { Document, Schema } from 'mongoose';

export const MIN_LENGTH_GROUP_NAME = 2;
export const MIN_GROUP_START_YEAR = 2020;

export interface GroupData {
  _id: mongoose.Types.ObjectId;
  name: string;
  startYear: number;
}

const groupSchema = new Schema({
  name: {
    required: true,
    type: String,
    minlength: MIN_LENGTH_GROUP_NAME,
  },

  startYear: {
    required: true,
    type: Number,
    min: MIN_GROUP_START_YEAR,
  },
});

type GroupDocument = GroupData & Document;

const Group = mongoose.model<GroupDocument>('Group', groupSchema);

export default Group;
