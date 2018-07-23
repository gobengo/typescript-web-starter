import { AsyncTest, Expect, TestCase, TestFixture } from "alsatian";
import * as React from "react"
import { readOrBuildClientStats } from '.';
import { TypescriptWebStarterApp } from '../client/components/apps/TypescriptWebStarterApp';
import { reducers } from "../client/reducers"
import clientProd, { clientStatsFilename } from '../etc/webpack/client.prod';
import { cli } from "../test/cli";
import { renderToHtml } from "./render"

const SampleApp: React.SFC = (props) => (
	<div>
		Hi I am a sample app for {__filename}
	</div>
)

/**
 * Sample tests to prove that testing works
 */
@TestFixture("Test server/render")
export class TestServerRender {
	// tslint:disable-line:export-name

	/** Test happy path when server side render results in some html */
	@TestCase("/")
	@AsyncTest("renderTestAsyncTest")
	public async renderTest(url: string): Promise<void> {
    const rendered = renderToHtml({
			App: SampleApp,
			path: url,
			clientStats: await readOrBuildClientStats(clientProd, clientStatsFilename),
			webpackConfig: clientProd,
			reducers,
    })
		Expect(typeof rendered.responseBody).toBe("string");
	}

	/** Test when server-side render results in HTTP redirect */
	@TestCase("/")
	@AsyncTest()
  public async redirectTest(url: string): Promise<void> {
    const rendered = renderToHtml({
			App: TypescriptWebStarterApp,
			path: url,
			clientStats: await readOrBuildClientStats(clientProd, clientStatsFilename),
			webpackConfig: clientProd,
			reducers,
		})
		const redirect = rendered.redirect
    Expect(redirect && typeof redirect.url).toEqual("string");
		Expect(redirect && redirect.url).toEqual("/things");
		Expect(redirect && redirect.status).toBe(undefined);
  }
}

if (require.main === module) {
	cli(__filename).catch(error => {
		throw error;
	});
}
