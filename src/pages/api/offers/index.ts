/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Data, OfferDocument } from '@/lib/types';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import { Offer } from '@/lib/Models/Offer';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { offerDataSchema } from '@/lib/Schemas/offer';
import { z } from 'zod';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';

dbConnect();
const logger = new Logger('API/OFFERS');

// eslint-disable-next-line require-await
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<OfferDocument[] | null>>,
): Promise<void> {
  switch (req.method) {
    case 'GET':
      {
        const options = {
          page: parseInt(req.query.page as string) || 0,
          limit: parseInt(req.query.limit as string) || 10,
        };
        const offers = await Offer.find()
          .sort({ startsAt: -1 })
          .skip(options.page * options.limit)
          .limit(options.limit)
          .exec();
        res.status(StatusCodes.OK).json({
          error: false,
          message: offers.length > 0 ? 'Found offers' : 'No offers were found',
          data: offers,
        });
      }
      break;

    case 'POST':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to create offer.');
          res.status(StatusCodes.UNAUTHORIZED).json({
            error: true,
            message: 'Unauthorized.',
          });
          return;
        }
        if (Object.keys(req.body).length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Empty body.',
          });
          return;
        }
        logger.debug(`Got body:\n${JSON.stringify(req.body, null, 2)}`);
        if (!offerDataSchema.safeParse(req.body).success) {
          res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Invalid body',
          });
          return;
        }
        const { title, description, image, startsAt, endsAt } =
          req.body as z.infer<typeof offerDataSchema>;

        try {
          logger.debug('Creating offer document...');
          const offer = new Offer({
            title,
            description,
            image,
            startsAt,
            endsAt,
          });
          await offer.save();
          logger.debug(`Created offer doc with id ${offer._id}`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Offer document created successfully',
          });
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to create offer document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to create offer document',
          });
        }
      }
      break;

    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        error: true,
        message: 'Method not allowed.',
      });
      break;
  }
}
