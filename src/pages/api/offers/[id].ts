/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Data, OfferDocument } from '@/lib/types';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import { Offer } from '@/lib/Models/Offer';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { isValidObjectId } from 'mongoose';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';

dbConnect();
const logger = new Logger('API/OFFERS/[ID]');

// eslint-disable-next-line require-await
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<OfferDocument | null>>,
): Promise<void> {
  const id = req.query.id as string;
  if (!isValidObjectId(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Invalid ObjectId.',
    });
    return;
  }
  switch (req.method) {
    case 'GET':
      {
        const offer = await Offer.findById(id);
        res
          .status(offer !== null ? StatusCodes.OK : StatusCodes.NOT_FOUND)
          .json({
            error: offer === null,
            message: offer !== null ? 'Found offer' : 'offer not found',
            data: offer,
          });
      }
      break;

    case 'PUT':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to edit offer.');
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
        const { title, description } = req.body as {
          title: string;
          description: string;
        };
        logger.debug(`Got body:\n${JSON.stringify(req.body, null, 2)}`);
        const offer = await Offer.findById(id);
        if (!offer) {
          res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: `offer with id ${id} was not found.`,
          });
          return;
        }
        try {
          logger.debug('Editing offer document...');
          await offer.edit({ title, description });
          logger.debug(`Edited Offer doc with id ${offer._id}`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Offer document edited successfully',
          });
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to edit the offer document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to edit the offer document',
          });
        }
      }
      break;

    case 'DELETE':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to delete offer');
          res.status(StatusCodes.UNAUTHORIZED).json({
            error: true,
            message: 'Unauthorized.',
          });
          return;
        }
        const offer = await Offer.findById(id);
        if (!offer) {
          res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: `offer with id ${id} was not found.`,
          });
          return;
        }
        try {
          await offer.deleteOne();
          logger.debug(`Deleted Offer doc with id ${id}`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Offer document deleted successfully',
          });
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to delete the offer document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to delete the offer document',
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
