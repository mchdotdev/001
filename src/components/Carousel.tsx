import { FC, useState } from 'react';

interface Props {
	images: Array<string>;
	tw?: string;
	btnTw?: string;
}

const Carousel: FC<Props> = ({ images, tw, btnTw }) => {
	const [current, setCurrent] = useState(0);

	const next = (): void => {
		setCurrent((current + 1) % images.length);
	};

	const prev = (): void => {
		setCurrent((current - 1 + images.length) % images.length);
	};

	return (
		<div className={`w-full p-5 lg:p-10 ${tw}`}>
			<div className='flex flex-row items-center justify-between'>
				<button
					onClick={prev}
					className={`${btnTw} text-stroke text-5xl hover:-translate-x-3 transition-all duration-300 ease-in font-bold`}
				>
					&lt;
				</button>
				<div
					className='invisible lg:visible bg-cover bg-center bg-no-repeat h-48 w-48'
					style={{
						backgroundImage: `url(${
							images[(current - 1 + images.length) % images.length]
						})`,
					}}
				></div>
				<div className='bg-gray-300 p-4 rounded-xl'>
					<div
						className='transition-all duration-300 ease-in-out bg-cover bg-center bg-no-repeat h-48 lg:h-72 w-48 lg:w-72 hover:scale-105'
						style={{
							backgroundImage: `url(${images[current]})`,
						}}
					></div>
				</div>
				<div
					className='invisible lg:visible bg-cover bg-center bg-no-repeat h-48 w-48'
					style={{
						backgroundImage: `url(${images[(current + 1) % images.length]})`,
					}}
				></div>
				<button
					onClick={next}
					className={`${btnTw} text-stroke text-5xl hover:translate-x-3 transition-all duration-300 ease-in font-bold`}
				>
					&gt;
				</button>
			</div>
			<div className='mt-5 flex flex-row items-center justify-center space-x-10'>
				{Array(images.length)
					.fill(0)
					.map((el, i) => {
						return (
							<p
								key={i}
								onClick={(): void => setCurrent(i % images.length)}
								className={`cursor-pointer w-3 h-3 drop-shadow-2xl shadow-slate-700 rounded-full ${
									i === current
										? 'bg-gray-50 ring-2 ring-green-500'
										: 'bg-gray-500 bg-opacity-25 hover:bg-opacity-50'
								}`}
							></p>
						);
					})}
			</div>
		</div>
	);
};

export default Carousel;
