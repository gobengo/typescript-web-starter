/**
 * main test module.
 * Execute this script to run all tests.
 */

import { cli } from "./cli";

if (require.main === module) {
	cli().catch(e => {
		throw e;
	});
}
