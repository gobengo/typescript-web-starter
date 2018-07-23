/**
 * Logging tools.
 */
type LogLevel = "debug" | "info" | "warn" | "error";
type LoggableThing = object | string;

// Log a log message at a certain logLevel
export const log = (level: LogLevel, ...args: LoggableThing[]): void => {
	switch (level) {
		case "info":
			// tslint:disable-next-line:no-console
			console.info(...args);
			break;
		case "debug":
		case "warn":
			// tslint:disable-next-line:no-console
			console.error(...args);
			break;
		default:
			// tslint:disable-next-line:no-console
			console.log(...args);
	}
};
