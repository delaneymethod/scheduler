import { format, transports, createLogger } from 'winston';

const { printf, combine } = format;

const logger = createLogger({
	exitOnError: false,
	transports: [new transports.Console()],
	format: combine(printf(info => info.message)),
});

const logMessage = (level, message) => ((process.env.NODE_ENV === 'development') ? logger.log({ level, message }) : null);

export default logMessage;
