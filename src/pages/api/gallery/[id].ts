/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Data, GImageDocument } from '@/lib/types';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import { GImage } from '@/lib/Models/GImage';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { v2 as cloudinary } from 'cloudinary';
import { isValidObjectId } from 'mongoose';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';

dbConnect();
const logger = new Logger('API/GALLERY/[ID]');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// eslint-disable-next-line require-await
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<GImageDocument | null>>,
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
        const image = await GImage.findById(id);
        res
          .status(image !== null ? StatusCodes.OK : StatusCodes.NOT_FOUND)
          .json({
            error: image === null,
            message: image !== null ? 'Found image' : 'Image not found',
            data: image,
          });
      }
      break;

    case 'PUT':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to edit gallery document.');
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
        const { title } = req.body as {
          title: string;
        };
        logger.debug(`Got body:\n${JSON.stringify(req.body, null, 2)}`);
        const image = await GImage.findById(id);
        if (!image) {
          res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: `GImage with id ${id} was not found.`,
          });
          return;
        }
        try {
          logger.debug('Editing gallery document...');
          await image.setTitle(title);
          logger.debug(`Edited Gimage doc with id ${image._id}`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'GImage document edited successfully',
          });
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to edit the GImage document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to edit the GImage document',
          });
        }
      }
      break;

    case 'DELETE':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to delete');
          res.status(StatusCodes.UNAUTHORIZED).json({
            error: true,
            message: 'Unauthorized.',
          });
          return;
        }
        const image = await GImage.findById(id);
        if (!image) {
          res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: `Image with id ${id} was not found.`,
          });
          return;
        }
        try {
          logger.debug('Deleting image from cloudinary...');
          cloudinary.uploader.destroy(image.publicId, {}, (err) => {
            if (err) logger.error('Failed to delete image from cloudinary.');
            else logger.debug('Deleted image from cloudinary.');
          });
          logger.debug('Deleting gallery document...');
          await image.deleteOne();
          logger.debug(`Deleted Gimage doc with id ${id}`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'GImage document deleted successfully',
          });
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to delete the document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to delete the document',
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
