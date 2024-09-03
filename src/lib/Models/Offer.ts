/* eslint-disable @typescript-eslint/indent */
import { Schema, SchemaTypes, models, model } from 'mongoose';
import { IOffer, OfferModel, OfferMethods, OfferDocument } from '../types';

export const offerSchema = new Schema<IOffer, OfferModel, OfferMethods>(
  {
    title: {
      type: SchemaTypes.String,
      required: true,
      minlength: [10, 'Title should be at least 10 characters long.'],
      maxlength: [50, 'Title cannot exceed 50 characters.'],
      default: 'Checkout this Power Gym offer!',
    },
    description: {
      type: SchemaTypes.String,
      required: true,
      minlength: [10, 'Title should be at least 10 characters long.'],
      maxlength: [100, 'Title cannot exceed 100 characters.'],
      default: 'Checkout this Power Gym offer!',
    },
    image: {
      type: SchemaTypes.String,
      required: true,
    },
    startsAt: {
      type: SchemaTypes.Number,
      required: true,
    },
    endsAt: {
      type: SchemaTypes.Number,
      required: true,
    },
  },
  {
    collection: 'offers',
    methods: {
      async edit(this: OfferDocument, offer: Partial<IOffer>): Promise<void> {
        if (offer.title) this.title = offer.title;
        if (offer.description) this.description = offer.description;
        if (offer.image) this.image = offer.image;
        if (offer.startsAt) this.startsAt = offer.startsAt;
        if (offer.endsAt) this.endsAt = offer.endsAt;
        await this.save();
      },
    },
  },
);

export const Offer =
  (models.Offer as OfferModel) ||
  model<IOffer, OfferModel>('Offer', offerSchema);
