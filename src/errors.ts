/**
 * Common Errors
 */

// Thrown when trying to access something, but it cannot be found (e.g. a 404)
export class NotFoundError extends Error {
	// tslint:disable-line:export-name
	constructor(message?: string) {
		super(message); // 'Error' breaks prototype chain here
		const target: typeof NotFoundError = new.target;
		Object.setPrototypeOf(this, target.prototype); // restore prototype chain // tslint:disable-line:no-unsafe-any
	}
}
