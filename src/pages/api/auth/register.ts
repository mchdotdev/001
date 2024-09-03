import type { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { register } from '@/lib/Helpers/Auth/Controllers/register';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { Data } from '@/lib/types';

dbConnect();
const logger = new Logger('API/AUTH/REGISTER');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
): Promise<void> {
	if (req.method === 'POST') await register(req, res, logger);
	else
		res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
			error: true,
			message: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
		});
}
