/* eslint-disable no-mixed-spaces-and-tabs */
import { HydratedDocument, Model, Types } from 'mongoose';

/* eslint-disable @typescript-eslint/indent */

//! Section reserved for Models
export interface IUser {
  name: string;
  userId: number;
  email: string;
  password: string;
  phoneNumber: string;
  avatar: string;
  role: UserRoles;
  createdAt: number;
  verified: boolean;
}

export enum UserRoles {
  MEMBER,
  ADMIN,
  OWNER,
  DEVELOPER,
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type UserModel = Model<IUser, {}, {}>;

export type UserDocument = HydratedDocument<IUser>;

export interface IGImage {
  publicId: string;
  title: string;
  url: string;
  metaData: {
    width: number;
    height: number;
  };
  createdAt: number;
}

export interface GImageMethods {
  setTitle(title: string): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type GImageModel = Model<IGImage, {}, GImageMethods>;

export type GImageDocument = HydratedDocument<IGImage, GImageMethods>;

export interface IOffer {
  title: string;
  description: string;
  image: string;
  startsAt: number;
  endsAt: number;
}

export interface OfferMethods {
  edit(offer: Partial<IOffer>): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type OfferModel = Model<IOffer, {}, OfferMethods>;

export type OfferDocument = HydratedDocument<IOffer, OfferMethods>;

export interface IPost {
  title: string;
  coverUrl: string;
  markdown: string;
  author: number;
  createdAt: number;
  lastModified: number;
}

export type PostModel = Model<IPost>;

export type PostDocument = HydratedDocument<IPost>;

export interface IView {
  ip: string;
  count: number;
  routeVisited: string;
  createdAt: Date;
}

export type ViewModel = Model<IView>;

export type ViewDocument = HydratedDocument<IView>;

//! End of Models section

//* Section reserved for API Types
export interface Data<T = null> {
  error: boolean;
  message: string;
  data?: T;
}

export interface CloudinaryApiResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: Array<string>;
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  metadata: object;
  existing: boolean;
  original_filename: string;
}

//* End of Api Types section

//! Section reserved for Lib types

export type Action =
  | {
      action: 'resize';
      imageUrl: string;
      w: string;
      h: string;
    }
  | {
      action: 'crop';
      imageUrl: string;
      w: string;
      h: string;
      x: string;
      y: string;
    }
  | {
      action: 'rotate';
      imageUrl: string;
      v: string;
    }
  | {
      action: 'opacity';
      imageUrl: string;
      v: string;
    }
  | {
      action: 'greyscale';
      imageUrl: string;
    }
  | {
      action: 'blur';
      imageUrl: string;
      v: string;
    }
  | {
      action: 'overlay';
      imageUrl: string;
      image: string;
      od: string;
      os: string;
    }
  | {
      action: 'text';
      imageUrl: string;
      content: string;
      x: string;
      y: string;
      bw: string;
      bh: string;
      align: string;
    }
  | {
      action: 'pixelate';
      imageUrl: string;
      v: string;
    }
  | {
      action: 'cirlcle';
      imageUrl: string;
    }
  | {
      action: 'sepia';
      imageUrl: string;
    }
  | {
      action: 'invert';
      imageUrl: string;
    };

//! End of Lib Types section

//? Section reserved for miscellaneous types

export enum VIEW_STATUS {
  CREATION_SUCCESS,
  CREATION_FAILURE,
  UPDATED_COUNT_SUCCESS,
  UPDATED_COUNT_FAILURE,
  DELETED_SUCCESS,
  DELETED_FAILURE,
}

export type SessionUserData = Omit<
  IUser,
  'password' | 'phoneNumber' | 'verified'
> & {
  _id: Types.ObjectId;
  lastUpdatedTimestamp: number;
};

export type Session = SessionUserData | null;

//? End of miscellaneous types section
