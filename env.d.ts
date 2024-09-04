/* eslint-disable @typescript-eslint/indent */
import type { SessionUserData } from '@/lib/types';
import type { DefaultUser } from 'next-auth';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      SALT_ROUNDS: string;
      JWT_KEY: string;
      MAIL_USER: string;
      MAIL_PASS: string;
      NEXT_PUBLIC_URL: string;
      CLOUDINARY_NAME: string;
      NEXT_PUBLIC_CLOUDINARY_NAME: string;
      CLOUDINARY_KEY: string;
      CLOUDINARY_SECRET: string;
      DISCORD_WEBHOOK_URL: string;
      COOKIE_NAME: string;
      NEXT_PUBLIC_COOKIE_NAME: string;
      COOKIE_SECRET: string;
      NEXT_PUBLIC_GML: string;
      NEXT_PUBLIC_TRACK_VIEWS: string;
      VIEWS_LIFETIME_D: string;
    }
  }
}

export {};
