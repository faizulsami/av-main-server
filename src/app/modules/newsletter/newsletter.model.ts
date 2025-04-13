import { model, Schema } from 'mongoose';

const NewsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const NewsletterModel = model('Newsletter', NewsletterSchema);
