declare module "react-jss/lib/jss" {
	export interface SheetsRegistryConstructor {
		new (): SheetsRegistry;
	}
	// export const SheetsRegistry: SheetsRegistryConstructor
	/**
	 * as-needed type for react-jss SheetsRegistry
	 */
	export class SheetsRegistry {
		constructor();
		public toString(): string;
	}
}
