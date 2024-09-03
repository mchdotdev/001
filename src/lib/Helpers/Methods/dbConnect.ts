/* eslint-disable @typescript-eslint/indent */
import { Logger } from '../Logging/Logger';
import { connect, ConnectionStates } from 'mongoose';

const logger = new Logger('METHODS/DBCONNECT');

const connection: { isConnected?: ConnectionStates } = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) return;
  try {
    const db = await connect(process.env.MONGO_URI);
    connection.isConnected = db.connections[0].readyState;
    logger.info(`Connection state: ${connection.isConnected}`);
  } catch (error) {
    logger.error(
      error instanceof Error
        ? error.message
        : 'An error has occurred trying to connect to MongoDB',
    );
  }
};

export default dbConnect;
