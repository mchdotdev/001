/* eslint-disable @typescript-eslint/indent */
import { JwtPayload, verify } from 'jsonwebtoken';
import { Logger } from '../Logging/Logger';
import { userSessionSchema } from '@/lib/Schemas/user';
import { SessionUserData } from '@/lib/types';

const logger = new Logger('/METHODS/JWT');

export const verifyToken = (
  token: string,
): { status: boolean; data: SessionUserData | null } => {
  try {
    const decoded = verify(token, process.env.JWT_KEY) as JwtPayload;
    delete decoded.iat;
    delete decoded.exp;
    if (!userSessionSchema.safeParse(decoded).success) {
      logger.debug('Failed to safely parse token data');
      return { status: false, data: null };
    }
    logger.debug(
      `Parsed token data successfully.\nDecoded object: ${JSON.stringify(
        decoded,
        null,
        2,
      )}`,
    );
    return { status: true, data: decoded as SessionUserData };
  } catch (error) {
    logger.error(
      `Caught an error while verifying the token:\n${
        error instanceof Error ? error.message : error
      }`,
    );
    return { status: false, data: null };
  }
};
