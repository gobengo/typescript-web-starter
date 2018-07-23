import * as React from "react";
import { log } from "./log";

/**
 * CLI for files that export a React Component
 * @param Component - React Component to show off
 */
export const cli = async (Component: React.ComponentType) => {
	// tslint:disable-next-line:no-submodule-imports
	const { renderToString } = await import("react-dom/server");
	log("info", renderToString(<Component />));
};
