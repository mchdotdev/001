/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Data, PostDocument } from '@/lib/types';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import { Post } from '@/lib/Models/Post';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { postDataSchema } from '@/lib/Schemas/post';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';

dbConnect();
const logger = new Logger('API/OFFERS/[ID]');

// eslint-disable-next-line require-await
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<PostDocument | null>>,
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
        try {
          const post = await Post.findById(id).exec();
          res
            .status(post !== null ? StatusCodes.OK : StatusCodes.NOT_FOUND)
            .json({
              error: post === null,
              message: post !== null ? 'Found Post' : 'Post not found',
              data: post,
            });
          return;
        } catch (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: `An error has occured: ${
              error instanceof Error ? error.message : error
            }`,
            data: null,
          });
        }
      }
      break;

    case 'PUT':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to edit Post.');
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
        if (!postDataSchema.safeParse(req.body).success) {
          res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Invalid body',
          });
          return;
        }
        const { title, markdown } = req.body as z.infer<typeof postDataSchema>;
        logger.debug(`Got body:\n${JSON.stringify(req.body, null, 2)}`);
        const post = await Post.findById(id);
        if (!post) {
          res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: `Post with id ${id} was not found.`,
          });
          return;
        }
        try {
          logger.debug('Editing Post document...');
          post.title = title;
          post.markdown = markdown;
          post.lastModified = Date.now();
          await post.save();
          logger.debug(`Edited Post doc with id ${post._id}`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Post document edited successfully',
          });
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to edit the Post document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to edit the Post document',
          });
        }
      }
      break;

    case 'DELETE':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to delete Post');
          res.status(StatusCodes.UNAUTHORIZED).json({
            error: true,
            message: 'Unauthorized.',
          });
          return;
        }
        const post = await Post.findById(id);
        if (!post) {
          res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: `Post with id ${id} was not found.`,
          });
          return;
        }
        try {
          await post.deleteOne();
          logger.debug(`Deleted Post doc with id ${id}`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Post document deleted successfully',
          });
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to delete the Post document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to delete the Post document',
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
