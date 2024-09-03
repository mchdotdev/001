/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Logger } from '../../Logging/Logger';
import { User } from '@/lib/Models/User';
import { sign } from 'jsonwebtoken';
import { createTransport } from 'nodemailer';
import { StatusCodes } from 'http-status-codes';
import { htmlEmail } from '../../Config/htmlEmail';
import type { Data } from '@/lib/types';

export const register = async (
  req: NextApiRequest & {
    body: {
      name: string;
      email: string;
      password: string;
      phoneNumber: string;
      emailsEnabled: boolean;
    };
  },
  res: NextApiResponse<Data>,
  logger: Logger,
  // eslint-disable-next-line require-await
): Promise<void> => {
  if (Object.keys(req.body).length === 0) {
    logger.debug('Empty body.');
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Empty body',
    });
    return;
  }
  const { name, email, password, phoneNumber } = req.body;
  logger.debug(
    `Processing registration...\nCredentials received: ${JSON.stringify(
      req.body,
      null,
      4,
    )}`,
  );
  logger.debug('Checking for existing credentials....');
  const existingName = await User.findOne({ name });
  const existingEmail = await User.findOne({ email });
  const existingPhoneNumber = await User.findOne({ phoneNumber });

  if (existingName) {
    logger.warn(
      `Found existing document with the same name (${existingName._id})`,
    );
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Username already registered.',
    });
    return;
  }

  if (existingEmail) {
    logger.warn(
      `Found existing document with the same email (${existingEmail._id})`,
    );
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Email already registered.',
    });
    return;
  }
  if (existingPhoneNumber) {
    logger.warn(
      `Found existing document with the same phone number (${existingPhoneNumber._id})`,
    );
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Phone number already registered.',
    });
    return;
  }

  logger.debug('Signing credentials with JWT...');

  const token = sign(
    { name, email, password, phoneNumber },
    process.env.JWT_KEY,
    { expiresIn: '30min' },
  );

  const websiteURL = process.env.NEXT_PUBLIC_URL;

  const transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  logger.info('Sending email...');

  try {
    const info = await transporter.sendMail({
      from: `Power Gym <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Verify your email.',
      html: htmlEmail(token, websiteURL),
    });
    logger.info(`Email sent.\nInfo: ${JSON.stringify(info, null, 4)}`);
    res.status(StatusCodes.OK).json({
      error: false,
      message: 'Email sent successfully.',
    });
  } catch (error) {
    logger.error(
      `${
        error instanceof Error
          ? error.message
          : 'An error has occurred trying to send verification email'
      }`,
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: `${
        error instanceof Error
          ? error.message
          : 'An error has occurred trying to send verification email'
      }`,
    });
  }
};
