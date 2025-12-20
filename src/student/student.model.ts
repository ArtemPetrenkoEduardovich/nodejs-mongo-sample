import mongoose, { Document, Schema } from 'mongoose';

export interface StudentAddressData {
  country: string;
  town: string;
  addressString: string;
}

export interface StudentData {
  _id: mongoose.Types.ObjectId;
  name: string;
  surname: string;
  groupId: string;
  birthDate: Date;
  phoneNumbers?: string[];
  address?: StudentAddressData;
}

const addressSchema = new Schema(
  {
    country: {
      required: true,
      type: String,
    },
    town: {
      required: true,
      type: String,
    },
    addressString: {
      required: true,
      type: String,
    },
  },
  {
    _id: false,
  },
);

export const studentSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },

    surname: {
      required: true,
      type: String,
    },

    groupId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },

    birthDate: {
      required: true,
      type: Date,
      validate: {
        validator: (value: Date): boolean => value <= new Date(),
        message: (props: { value: Date }): string =>
          `Birth date cannot be in the future. Provided date: ${props.value}`,
      },
    },

    phoneNumbers: {
      required: false,
      type: Array,
    },

    address: {
      required: false,
      type: addressSchema,
    },
  },
  {
    /**
     * The timestamps option tells mongoose to assign createdAt and updatedAt
     * fields to your schema. The type assigned is Date.
     */
    timestamps: true,
    timezone: 'UTC',
  },
);

type StudentDocument = StudentData & Document;

const Student = mongoose.model<StudentDocument>('Student', studentSchema);

export default Student;
