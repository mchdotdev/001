import { ButtonHTMLAttributes, FC } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon: Icons;
}

type Icons = 'edit' | 'delete' | 'search' | 'eye';

const IconButton: FC<Props> = ({ icon, ...props }) => {
	return (
		<button {...props}>
			{icon === 'edit' ? (
				<svg
					className='inline-block align-middle'
					width={24}
					height={24}
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g
						id='SVGRepo_bgCarrier'
						strokeWidth='0'
					></g>
					<g
						id='SVGRepo_tracerCarrier'
						strokeLinecap='round'
						strokeLinejoin='round'
					></g>
					<g id='SVGRepo_iconCarrier'>
						{' '}
						<path
							d='M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z'
							stroke={props.disabled ? '#e40707' : '#000000'}
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						></path>{' '}
					</g>
				</svg>
			) : icon === 'delete' ? (
				<svg
					className='inline-block align-middle'
					width={24}
					height={24}
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					stroke='#d40808'
				>
					<g
						id='SVGRepo_bgCarrier'
						strokeWidth='0'
					></g>
					<g
						id='SVGRepo_tracerCarrier'
						strokeLinecap='round'
						strokeLinejoin='round'
					></g>
					<g id='SVGRepo_iconCarrier'>
						{' '}
						<path
							d='M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6'
							stroke='#e40707'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						></path>{' '}
					</g>
				</svg>
			) : icon === 'search' ? (
				<svg
					className='inline-block align-middle'
					width={24}
					height={24}
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g
						id='SVGRepo_bgCarrier'
						strokeWidth='0'
					></g>
					<g
						id='SVGRepo_tracerCarrier'
						strokeLinecap='round'
						strokeLinejoin='round'
					></g>
					<g id='SVGRepo_iconCarrier'>
						{' '}
						<path
							d='M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z'
							stroke='#000000'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						></path>{' '}
					</g>
				</svg>
			) : (
				<svg
					className='inline-block align-middle'
					width={24}
					height={24}
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g
						id='SVGRepo_bgCarrier'
						strokeWidth='0'
					></g>
					<g
						id='SVGRepo_tracerCarrier'
						strokeLinecap='round'
						strokeLinejoin='round'
					></g>
					<g id='SVGRepo_iconCarrier'>
						{' '}
						<path
							d='M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z'
							stroke='#000000'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						></path>{' '}
						<path
							d='M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z'
							stroke='#000000'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						></path>{' '}
					</g>
				</svg>
			)}
		</button>
	);
};

export default IconButton;
