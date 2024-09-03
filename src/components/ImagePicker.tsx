/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import { FC, SetStateAction, Dispatch, useState, useEffect } from 'react';
import Image from 'next/image';

interface Props {
	images: string[];
	image: string;
	setImage: Dispatch<SetStateAction<string>>;
	tw?: string;
}

const ImagePicker: FC<Props> = ({ images, image, setImage, tw }) => {
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (images) {
			setTimeout(() => {
				setLoading(false);
			}, 1 * 1000);
		}
	}, [images]);
	return (
		<div
			className={`${tw} w-60 h-80 overflow-y-auto bg-gray-200 rounded-lg grid ${
				images.length > 0 ? 'grid-cols-3' : 'grid-cols-1'
			} gap-2 place-items-center p-3 shadow-xl`}
		>
			{images.length > 0 ? (
				loading === false ? (
					images.map((img, i) => {
						return (
							<Image
								key={i}
								src={img}
								alt='Select image'
								title={img === image ? 'Selected' : 'Select image'}
								width={100}
								height={100}
								className={`cursor-pointer hover:scale-105 transition-all duration-300 ease-linear ${
									img === image ? 'border-b-8 border-green-500' : ''
								}`}
								onClick={(): void => setImage(img)}
								loading={'lazy'}
							/>
						);
					})
				) : (
					Array(10)
						.fill(0)
						.map((el, i) => {
							return (
								<div
									key={i}
									className='w-16 h-16 bg-gray-300 rounded-lg shadow-lg animate-pulse'
								></div>
							);
						})
				)
			) : (
				<p className='text-center'>No images found</p>
			)}
		</div>
	);
};

export default ImagePicker;
