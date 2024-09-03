/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Data, GImageDocument } from '@/lib/types';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import { GImage } from '@/lib/Models/GImage';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { z } from 'zod';
import { imageDataSchema } from '@/lib/Schemas/image';
import { getServerSession } from '@/lib/Helpers/Methods/user';
import { isAdmin } from '@/lib/Helpers/Methods/user';

dbConnect();
const logger = new Logger('API/GALLERY');

// eslint-disable-next-line require-await
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<GImageDocument[] | null>>,
): Promise<void> {
  switch (req.method) {
    case 'GET':
      {
        const options = {
          page: parseInt(req.query.page as string) || 0,
          limit: parseInt(req.query.limit as string) || 10,
          random: req.query.random,
          all: req.query.all,
        };
        if (options.all === 'true') {
          const images = await GImage.find();
          res.status(StatusCodes.OK).json({
            error: false,
            message:
              images.length > 0 ? 'Found images' : 'No images were found',
            data: images,
          });
          return;
        }
        if (options.random === 'true') {
          const documents = await GImage.countDocuments().exec();
          const results: GImageDocument[] = [];
          for (let i = 0; i < options.limit; i++) {
            const random = Math.floor(Math.random() * documents);
            const doc = await GImage.findOne().skip(random).exec();
            if (doc !== null) results.push(doc);
          }

          res.status(StatusCodes.OK).json({
            error: false,
            message:
              results.length > 0 ? 'Found images' : 'No images were found',
            data: results,
          });
          return;
        }
        const images = await GImage.find()
          .sort({ createdAt: -1 })
          .skip(options.page * options.limit)
          .limit(options.limit)
          .exec();
        res.status(StatusCodes.OK).json({
          error: false,
          message: images.length > 0 ? 'Found images' : 'No images were found',
          data: images,
        });
      }
      break;

    case 'POST':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to create gallery document.');
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
        if (!imageDataSchema.safeParse(req.body).success) {
          res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Invalid body',
          });
          return;
        }
        const { url, title, metaData, publicId } = req.body as z.infer<
          typeof imageDataSchema
        >;
        logger.debug(`Got body:\n${JSON.stringify(req.body, null, 2)}`);
        try {
          logger.debug('Creating gallery document...');
          const image = new GImage({
            url,
            title,
            publicId,
            metaData,
          });
          await image.save();
          logger.debug(`Created Gimage doc with id ${image._id}`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'GImage document created successfully',
          });
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to create image document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to create image document',
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
