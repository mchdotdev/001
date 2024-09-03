import { ChangeEvent, FC, useState, useEffect } from 'react';
import { GImageDocument, Session, UserRoles, Data } from '@/lib/types';
import Image from 'next/image';
import GalleryImage from './GalleryImage';
import Toast, { ToastOptions, clearMessage } from './Toast';
import Modal from './Modal';
import IconButton from './IconButton';

interface Props {
	image: GImageDocument;
	session: Session;
	suggestedImages: GImageDocument[];
}

const GalleryImageView: FC<Props> = ({ image, session, suggestedImages }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [title, setTitle] = useState(image.title);
	const [disabled, setDisabled] = useState(
		title === image.title || title.length < 10 || title.length > 50,
	);
	const [message, setMessage] = useState<ToastOptions>({
		type: 'info',
		title: '',
		description: '',
	});

	useEffect(() => {
		if (title !== image.title) setTitle(image.title);
	}, [image]);

	const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
		setTitle(e.target.value);
		setDisabled(
			e.target.value === image.title ||
				e.target.value.length < 10 ||
				e.target.value.length > 50,
		);
	};

	// eslint-disable-next-line require-await
	const changeTitle = async (): Promise<void> => {
		setMessage({
			type: 'loading',
			description: 'Editing title...',
			title: 'Loading...',
		});
		const res = await fetch(`/api/gallery/${image._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title }),
		});
		const response = (await res.json()) as Data;
		clearMessage(setMessage);
		if (res.ok) {
			setMessage({
				type: 'success',
				title: 'Success!',
				description: 'Image title was edited successfully.',
			});
			clearMessage(setMessage, 5000);
			setDisabled(true);
			return;
		}
		setMessage({
			type: 'error',
			title: 'Error!',
			description: response.message,
		});
		clearMessage(setMessage, 5000);
	};

	// eslint-disable-next-line require-await
	const deleteImage = async (): Promise<void> => {
		setIsVisible(false);
		setMessage({
			type: 'loading',
			title: 'Loading...',
			description: 'Deleting image',
		});
		const res = await fetch(`/api/gallery/${image._id}`, {
			method: 'DELETE',
		});
		const response = (await res.json()) as Data;
		clearMessage(setMessage);
		if (res.ok) {
			setMessage({
				type: 'success',
				title: 'Success!',
				description: 'Image deleted!',
			});
			clearMessage(setMessage, 3000);
			setTimeout(() => {
				window.location.href = '/gallery';
			}, 3000);
			return;
		}
		setMessage({
			type: 'error',
			title: 'Error!',
			description: response.message,
		});
		clearMessage(setMessage, 3000);
	};

	return (
		<>
			<div className='w-auto h-auto bg-gray-100 rounded-md shadow-lg'>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:place-items-center p-5 space-x-5'>
					<Image
						src={image.url}
						title={image.title}
						alt={image.title}
						width='300'
						height='300'
						className='mx-auto'
					/>
					<div className='flex flex-col'>
						{session && session.role >= UserRoles.ADMIN ? (
							<div className='mt-5 sm:mt-0'>
								<textarea
									value={title}
									className='inline-block align-middle bg-transparent text-md sm:text-lg md:text-xl font-bold focus:outline-none border-b-2 border-gray-300 mr-1 resize'
									onChange={onTextChange}
									minLength={10}
									maxLength={50}
									key={image.id}
								/>
								<div className='inline-block align-middle'>
									<IconButton
										icon='edit'
										disabled={disabled}
										onClick={changeTitle}
										title={disabled ? 'Cant edit' : 'Click to edit'}
									/>
									<IconButton
										icon='delete'
										title='Delete image'
										onClick={(): void => setIsVisible(true)}
									/>
								</div>
							</div>
						) : (
							<h1 className='text-2xl font-bold'>{image.title}</h1>
						)}
						<h1>Taken at {new Date(image.createdAt).toLocaleDateString()}</h1>
						<p className='text-lg font-semibold mb-3'>Suggested:</p>
						<div className='flex flex-row items-center justify-start space-x-2'>
							{suggestedImages?.map((img, i) => {
								return (
									<GalleryImage
										key={i}
										image={img}
										tw='w-12 h-12'
									/>
								);
							})}
						</div>
					</div>
				</div>
				<button
					onClick={(): string => (window.location.href = '/gallery')}
					className='float-right mt-1 bg-yellow-500 p-4 rounded-lg text-white font-semibold hover:-translate-x-3 transition-all duration-300 ease-in-out'
				>
					Gallery
				</button>
			</div>
			{message.title !== '' && message.description !== '' && (
				<Toast data={message} />
			)}
			<Modal
				setShow={setIsVisible}
				show={isVisible}
				title='Are you sure you want to delete this image?'
			>
				<button
					className='text-white text-semibold text-lg bg-red-600 rounded-lg ring-2 p-3 inline-block align-middle mr-3'
					onClick={(): void => setIsVisible(false)}
				>
					Cancel
				</button>
				<button
					className='text-white text-semibold text-lg bg-green-600 rounded-lg ring-2 p-3 inline-block align-middle'
					onClick={deleteImage}
				>
					Confirm
				</button>
			</Modal>
		</>
	);
};

export default GalleryImageView;
