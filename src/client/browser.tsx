/**
 * Main entrypoint for booting app in a web browser.
 * Initialize the app, load state send down by server-side rendering, and render in root DOM element.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TypescriptWebStarterApp } from './components/apps/TypescriptWebStarterApp';
import { BrowserAppContainer } from './components/containers/BrowserAppContainer';
import { reducers } from "./reducers"

const render = (AppComponent: typeof TypescriptWebStarterApp) => {
	const el = document.getElementById("root");
	const node = (
		<BrowserAppContainer reducers={reducers}>
			{ TypescriptWebStarterApp }
		</BrowserAppContainer>
	);
	ReactDOM.render(node, el);
};


render(TypescriptWebStarterApp);
