import * as React from "react";
import { AppContainer } from "react-hot-loader";

export const jssSsrId = "jss-ssr";

export const removeSsrStyles = (document: Document) => {
	const jssStyles = document.getElementById(jssSsrId);
	if (jssStyles && jssStyles.parentNode) {
		jssStyles.parentNode.removeChild(jssStyles);
	}
};

/**
 * Wraps a component that is booting up after a server-side render.
 * It will need to clean up after the SSR process.
 * e.g., it will look for <style> tags added by SSR and remove them.
 * @inheritDoc
 */
class AppAfterSSR extends React.Component {
	public componentDidMount(): void {
		removeSsrStyles(document);
	}
	/** Render Component to React.Node */
	public render(): React.ReactNode {
		return <>{this.props.children}</>;
	}
}

export const SSR: React.SFC<{ children?: React.ReactElement<{}> }> = ({
	children,
}) => (
	<AppContainer>
		<AppAfterSSR>{children}</AppAfterSSR>
	</AppContainer>
);
