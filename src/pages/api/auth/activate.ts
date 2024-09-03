import type { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { activate } from '@/lib/Helpers/Auth/Controllers/activate';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { Data } from '@/lib/types';

dbConnect();
const logger = new Logger('API/AUTH/ACTIVATE');

export default async function handler(
	req: NextApiRequest & {
		query: {
			token: string;
		};
	},
	res: NextApiResponse<Data>,
): Promise<void> {
	if (req.method === 'GET') await activate(req, res, logger);
	else
		res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
			error: true,
			message: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
		});
}
