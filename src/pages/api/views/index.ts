/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Data, ViewDocument } from '@/lib/types';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import {
  addView,
  getAllViews,
  getViewsByIp,
  getViewsForPage,
  getViewsOnDate,
  getViewsWithPagination,
  purgeAll,
  purgeViewsWithIp,
  purgeViewsWithThisIp,
} from '@/lib/Helpers/Views/controller';

dbConnect();

const logger = new Logger('/API/VIEWS');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<ViewDocument[] | null>>,
): Promise<void> {
  switch (req.method) {
    case 'DELETE':
      {
        const session = getServerSession(req);
        if (!isAdmin(session))
          return res.status(StatusCodes.FORBIDDEN).json({
            error: true,
            message: getReasonPhrase(StatusCodes.FORBIDDEN),
          });
        const all = req.query.all as string;
        if (all && all === 'true') return await purgeAll(req, res);
        const ip = req.body.ip as string;
        if (typeof ip !== 'undefined') await purgeViewsWithIp(ip, res);
      }
      break;

    case 'GET':
      {
        const session = getServerSession(req);
        if (!isAdmin(session))
          return res.status(StatusCodes.FORBIDDEN).json({
            error: true,
            message: getReasonPhrase(StatusCodes.FORBIDDEN),
          });
        const { date, ip, route, all, limit, page, deleteme } = req.query as {
          date: string;
          ip: string;
          route: string;
          all: string;
          limit: string;
          page: string;
          deleteme: string;
        };
        // for debugging purposes
        if (deleteme === 'yes') return await purgeViewsWithThisIp(req, res);
        if (typeof ip !== 'undefined') {
          return await getViewsByIp(ip, res);
        }
        if (typeof date !== 'undefined') {
          return await getViewsOnDate(new Date(date), res);
        }
        if (typeof route !== 'undefined') {
          return await getViewsForPage(route, res);
        }
        if (all === 'true') {
          return await getAllViews(res);
        }
        if (
          typeof page !== 'undefined' &&
          typeof limit !== 'undefined' &&
          isNaN(parseInt(limit)) &&
          isNaN(parseInt(page))
        ) {
          return await getViewsWithPagination(
            res,
            parseInt(limit),
            parseInt(page),
          );
        }
      }
      break;

    case 'PUT':
      {
        const { routeVisited } = req.body as { routeVisited: string };
        logger.debug(`Got body: ${JSON.stringify(req.body, null, 2)}`);
        if (Object.keys(req.body).length !== 1)
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'body is missing `routeVisited` property',
          });
        await addView(routeVisited, req, res);
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
