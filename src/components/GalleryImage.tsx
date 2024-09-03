/* eslint-disable @typescript-eslint/indent */
import { FC } from 'react';
import { GImageDocument } from '@/lib/types';
import Image from 'next/image';

interface Props {
  image: GImageDocument;
  tw?: string;
}

const GalleryImage: FC<Props> = ({ image, tw }) => {
  return (
    <div className={tw}>
      <div
        className='hover:scale-90 hover:rotate-6 transition-all duration-700 ease-linear w-auto h-auto cursor-pointer'
        onClick={(): string => (window.location.href = `/gallery/${image._id}`)}
      >
        <Image
          src={image.url}
          width={image.metaData.width}
          height={image.metaData.height}
          alt={image.title}
          title={image.title}
          loading='lazy'
        />
      </div>
    </div>
  );
};

export default GalleryImage;
