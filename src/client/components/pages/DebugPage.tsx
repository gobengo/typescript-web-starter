/**
 * Page a developer can use to debug some stuff. Should not be shown to real end-users.
 */
import * as React from "react";
import { connect } from "react-redux"
import { DefaultState } from "../../store"

/**
 * Little page servd at /debug to test things out at
 */
export const DebugPage = connect(
	(state: DefaultState) => ({ state }),
)(({ state }) => {
	return (
		<>
			<h1>DebugPage</h1>
			<h2>State</h2>
			<pre>${JSON.stringify(state, null, 2)}</pre>
		</>
	);
})
