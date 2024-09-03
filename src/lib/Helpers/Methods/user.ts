/* eslint-disable @typescript-eslint/indent */
import { hash, genSalt, compare } from 'bcrypt';
import { Logger } from '../Logging/Logger';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import {
  type Session,
  type Data,
  UserRoles,
  SessionUserData,
} from '@/lib/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './jwt';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { StatusCodes } from 'http-status-codes';

const logger = new Logger('METHODS/USER');

/**
 * @description Creating an encrypted password from the user's input
 * @param input User's form input
 * @returns string
 */

export const createPassword = async (input: string): Promise<string> => {
  const salt = await genSalt(Number(process.env.SALT_ROUNDS));
  const hashed = await hash(input, salt);
  return hashed;
};

/**
 * @description Comparing the user's input and the saved password
 * @param input User's form input
 * @param userPassword  User's saved password
 * @returns boolean
 */

export const comparePassword = async (
  input: string,
  userPassword: string,
): Promise<boolean> => {
  try {
    const isMatch = await compare(input, userPassword);
    return isMatch;
  } catch (error) {
    logger.error(
      error instanceof Error
        ? error.message
        : 'An error has occurred trying to compare passwords',
    );
    return false;
  }
};

/**
 * @param length specify the length of the random integer
 * @returns a random integer with a specific length
 */
export const generateId = (length: number): number => {
  let result = String(Math.floor(Math.random() * 9) + 1);
  for (let i = 0; i < length - 1; i++) {
    result += String(Math.floor(Math.random() * 9));
  }
  return Number(result);
};

/**
 * fetch the session in getServersideProps
 * @param req request object
 */

export const getSession = (
  req: IncomingMessage & { cookies: NextApiRequestCookies },
): Session => {
  const cookie = req.cookies[process.env.NEXT_PUBLIC_COOKIE_NAME];
  if (typeof cookie !== 'undefined' && cookie !== '') {
    const { data } = verifyToken(cookie!);
    return data;
  }
  return null;
};

/**
 * get the session data in api routes
 * @param req request object
 * @returns session
 */

export const getServerSession = (req: NextApiRequest): Session => {
  const token = req.cookies[process.env.COOKIE_NAME] || req.headers.cookie;
  if (!token) return null;
  const { data } = verifyToken(token);
  return data;
};

export const mutateSession = (
  payload: SessionUserData,
  res: NextApiResponse,
): void => {
  const token = sign(
    { ...payload, lastUpdatedTimestamp: Date.now() },
    process.env.JWT_KEY,
    {
      expiresIn: 60 * 60 * 24,
    },
  );
  const serialized = serialize(process.env.COOKIE_NAME, token, {
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
};

export const logout = (res: NextApiResponse): void => {
  const serialized = serialize(process.env.COOKIE_NAME, '', {
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
  res.status(StatusCodes.OK).redirect('/');
};

export const isAdmin = (session: Session): boolean => {
  return session !== null && session.role >= UserRoles.ADMIN;
};

export const isOwner = (session: Session): boolean => {
  return session !== null && session.role >= UserRoles.OWNER;
};

export const isDeveloper = (session: Session): boolean => {
  return session !== null && session.role === UserRoles.DEVELOPER;
};

export const isLoggedIn = (session: Session): boolean => {
  return session !== null;
};

export const fetchWithCookie = async (
  nextJsReq: IncomingMessage & {
    cookies: NextApiRequestCookies;
  },
  route: string,
  options?: RequestInit,
): Promise<Response> => {
  return await fetch(route, {
    ...options,
    headers: {
      'Cookie': nextJsReq.cookies[process.env.NEXT_PUBLIC_COOKIE_NAME]!,
    },
  });
};
