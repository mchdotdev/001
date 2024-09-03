/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Data, PostDocument } from '@/lib/types';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { Post } from '@/lib/Models/Post';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { escapeRegex } from '@/lib/Helpers/Methods/escapeRegex';
import { postDataSchema } from '@/lib/Schemas/post';
import { z } from 'zod';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';

dbConnect();
const logger = new Logger('API/POSTS');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<PostDocument[] | null>>,
): Promise<void> {
  switch (req.method) {
    case 'GET':
      {
        const options = {
          page: parseInt(req.query.page as string) || 0,
          limit: parseInt(req.query.limit as string) || 10,
          search: req.query.search as string,
          random: req.query.random as string,
          all: req.query.all as string,
        };
        if (options.all === 'true') {
          const posts = await Post.find().sort({ createdAt: -1 }).exec();
          res.status(StatusCodes.OK).json({
            error: false,
            message: posts.length > 0 ? 'Found posts' : 'No posts were found',
            data: posts,
          });
          return;
        }
        if (options.search) {
          const posts = await Post.find({
            title: new RegExp(escapeRegex(options.search), 'gi'),
          })
            .sort({ createdAt: -1 })
            .exec();
          res.status(StatusCodes.OK).json({
            error: false,
            message: posts.length > 0 ? 'Found posts' : 'No posts were found',
            data: posts,
          });
          return;
        }
        if (options.random === 'true') {
          const documents = await Post.countDocuments().exec();
          const results: PostDocument[] = [];
          for (let i = 0; i < options.limit; i++) {
            const random = Math.floor(Math.random() * documents);
            const doc = await Post.findOne().skip(random).exec();
            if (doc !== null) results.push(doc);
          }

          res.status(StatusCodes.OK).json({
            error: false,
            message: results.length > 0 ? 'Found posts' : 'No posts were found',
            data: results,
          });
          return;
        }
        const posts = await Post.find()
          .sort({ createdAt: -1 })
          .skip(options.page * options.limit)
          .limit(options.limit)
          .exec();
        res.status(StatusCodes.OK).json({
          error: false,
          message: posts.length > 0 ? 'Found posts' : 'No posts were found',
          data: posts,
        });
      }
      break;

    case 'POST':
      {
        const session = getServerSession(req);
        if (!isAdmin(session)) {
          logger.debug('Unauthorized attempt to create post document.');
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
          res.status(StatusCodes.BAD_GATEWAY).json({
            error: true,
            message: 'Invalid body',
          });
          return;
        }
        logger.debug(`Got body:\n${JSON.stringify(req.body, null, 2)}`);
        const { title, markdown, coverUrl } = req.body as z.infer<
          typeof postDataSchema
        >;
        const existingTitle = await Post.findOne({ title });
        if (existingTitle) {
          res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'A post with a similar name already exists',
          });
          return;
        }
        const post = new Post({
          title,
          markdown,
          coverUrl,
          author: session!.userId,
        });
        try {
          await post.save();
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Post created successfully',
          });
          return;
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to save post document',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to save post document',
          });
        }
      }
      break;

    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        error: true,
        message: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
      });
      break;
  }
}
