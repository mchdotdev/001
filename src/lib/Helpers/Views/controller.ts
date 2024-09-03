/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { View } from '@/lib/Models/View';
import { Logger } from '../Logging/Logger';
import type { Data, ViewDocument } from '@/lib/types';
import { StatusCodes } from 'http-status-codes';

const logger = new Logger('/VIEWS/CONTROLLER');

export const getRequestIp = (req: NextApiRequest): string => {
  return (req.headers['x-real-ip'] as string)
    ? (req.headers['x-real-ip'] as string).replace('::ffff:', '')
    : (req.headers['x-forwarded-for'] as string)
        ?.split(',')[0]
        .replace('::ffff:', '') ?? 'Unknown';
};

export const addView = async (
  route: string,
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> => {
  const requestIp = getRequestIp(req);
  logger.debug(
    `Ip: ${requestIp}\nLooking for an existing record of the route ${route} visited by this IP...`,
  );
  const existingView = await View.findOne({
    ip: requestIp,
    routeVisited: route,
  });
  if (existingView === null) {
    logger.debug(
      'This IP has never viewed this route before, creating a new record...',
    );
    try {
      const view = await View.create({
        ip: requestIp,
        routeVisited: route,
        count: 1,
      });
      await view.save();
      logger.info('Saved view!');
      return res.status(StatusCodes.OK).json({
        error: false,
        message: 'Saved view',
      });
    } catch (error) {
      logger.error(
        `An error has occured trying to save view record: ${
          error instanceof Error ? error.message : error
        }`,
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `An error has occured trying to save view record: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  } else {
    logger.debug(
      'This IP has viewed this route before, incrementing the view count...',
    );
    try {
      existingView.count = existingView.count + 1;
      await existingView.save();
      logger.info('Incremented view count!');
      return res.status(StatusCodes.OK).json({
        error: false,
        message: 'Incremented view count',
      });
    } catch (error) {
      logger.error(
        `An error has occured trying to update view record: ${
          error instanceof Error ? error.message : error
        }`,
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `An error has occured trying to update view record: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  }
};

export const purgeViewsWithIp = async (
  ip: string,
  res: NextApiResponse,
): Promise<void> => {
  const views = await View.find({ ip: ip });
  if (views && views.length > 0) {
    try {
      for (const view of views) {
        logger.debug(
          `Deleting view: ${view.id} by ${ip} who visited ${view.routeVisited}...`,
        );
        await view.deleteOne();
      }
      logger.info(`Deleted every view from IP: ${ip}`);
      return res.status(StatusCodes.OK).json({
        error: false,
        message: 'Deleted views',
      });
    } catch (error) {
      logger.error(
        `An error has occured trying to update view record: ${
          error instanceof Error ? error.message : error
        }`,
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `An error has occured trying to save view record: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  } else {
    logger.info(`Couldn't find any views from IP: ${ip}`);
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: false,
      message: 'No views from this IP',
    });
  }
};

export const purgeViewsWithThisIp = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const ip = getRequestIp(req);
  const views = await View.find({ ip: ip });
  if (views && views.length > 0) {
    try {
      for (const view of views) {
        logger.debug(
          `Deleting view: ${view.id} by ${ip} who visited ${view.routeVisited}...`,
        );
        await view.deleteOne();
      }
      logger.info(`Deleted every view from IP: ${ip}`);
      return res.status(StatusCodes.OK).json({
        error: false,
        message: 'Deleted views',
      });
    } catch (error) {
      logger.error(
        `An error has occured trying to update view record: ${
          error instanceof Error ? error.message : error
        }`,
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `An error has occured trying to save view record: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  } else {
    logger.info(`Couldn't find any views from IP: ${ip}`);
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: false,
      message: 'No views from this IP',
    });
  }
};

export const purgeAll = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> => {
  try {
    await View.deleteMany();
    return res.status(StatusCodes.OK).json({
      error: false,
      message: 'Purged views',
    });
  } catch (error) {
    logger.error(
      `An error has occured trying to update purge views: ${
        error instanceof Error ? error.message : error
      }`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: `An error has occured trying to purge views: ${
        error instanceof Error ? error.message : error
      }`,
    });
  }
};

export const getViewsByIp = async (
  ip: string,
  res: NextApiResponse<Data<ViewDocument[] | null>>,
): Promise<void> => {
  logger.debug(`Looking up pages viewed by IP: ${ip}`);
  const views = await View.find({ ip }).sort('desc');
  if (views && views.length > 0) {
    return res.status(StatusCodes.OK).json({
      error: false,
      message: 'Found views',
      data: views,
    });
  }
  return res.status(StatusCodes.NOT_FOUND).json({
    error: false,
    message: 'No data was found on record',
    data: null,
  });
};

export const getViewsOnDate = async (
  date: Date,
  res: NextApiResponse<Data<ViewDocument[] | null>>,
): Promise<void> => {
  logger.debug(`Finding views on ${date.toLocaleString()}...`);
  const views = await View.find({ createdAt: { $gte: date } })
    .sort('desc')
    .exec();
  if (views && views.length > 0) {
    return res.status(StatusCodes.OK).json({
      error: false,
      message: 'Found views',
      data: views,
    });
  }
  return res.status(StatusCodes.NOT_FOUND).json({
    error: false,
    message: 'No data was found on record',
    data: null,
  });
};

export const getViewsForPage = async (
  route: string,
  res: NextApiResponse<Data<ViewDocument[] | null>>,
): Promise<void> => {
  logger.debug(`Finding views for route ${route}...`);
  const views = await View.find({ routeVisited: route }).sort('desc');
  if (views && views.length > 0) {
    return res.status(StatusCodes.OK).json({
      error: false,
      message: 'Found views',
      data: views,
    });
  }
  return res.status(StatusCodes.NOT_FOUND).json({
    error: false,
    message: 'No data was found on record',
    data: null,
  });
};

export const getAllViews = async (
  res: NextApiResponse<Data<ViewDocument[] | null>>,
): Promise<void> => {
  const views = await View.find().sort('desc');
  if (views && views.length > 0) {
    return res.status(StatusCodes.OK).json({
      error: false,
      message: 'Found views',
      data: views,
    });
  }
  return res.status(StatusCodes.NOT_FOUND).json({
    error: false,
    message: 'No data was found on record',
    data: null,
  });
};

export const getViewsWithPagination = async (
  res: NextApiResponse<Data<ViewDocument[] | null>>,
  limit: number,
  page: number,
): Promise<void> => {
  const views = await View.find()
    .sort('desc')
    .skip(page * limit)
    .limit(limit)
    .exec();
  if (views && views.length > 0) {
    return res.status(StatusCodes.OK).json({
      error: false,
      message: 'Found views',
      data: views,
    });
  }
  return res.status(StatusCodes.NOT_FOUND).json({
    error: false,
    message: 'No data was found on record',
    data: null,
  });
};
