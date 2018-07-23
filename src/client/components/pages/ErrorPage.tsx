/**
 * Render for user when an unexpected error occurs
 */
import * as React from "react";

export const ErrorPage: React.SFC<{ error: Error }> = ({ error }) => (
  <h1>
    an Error occurred: {error.name} - {error.message}
  </h1>
);
