import * as React from "react"

export interface ErrorBoundaryProps {
	children(error?: Error): React.ReactNode;
}

interface ErrorBoundaryState {
	error?: Error;
}

/**
 * Catch unexpected errors in children components and render the error nicely.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {};
	}
	public componentDidCatch(error: Error, info: React.ErrorInfo): void {
		// Display fallback UI
		this.setState({ error });
		// You can also log the error to an error reporting service
		// logErrorToMyService(error, info);
	}
	/** render Component state+props for DOM */
	public render(): React.ReactNode {
		return this.props.children(this.state.error);
	}
}
