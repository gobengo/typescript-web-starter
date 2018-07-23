import { TestOutputStream, TestRunner, TestSet } from "alsatian";
import { config as dotenv } from "dotenv";
import { join } from "path";
import { Duplex } from "stream";
import { TapBark } from "tap-bark";

type TestCLI = (filename?: string) => Promise<void>;

/**
 * Test CLI
 * If passed a filename, will run test in that file.
 * Otherwise, run tests in all files.
 */
export const cli: TestCLI = async (filename?: string): Promise<void> => {
	await main(filename);
};

/**
 * Run all tests
 */
async function main(filename?: string): Promise<void> {
	// Load up any pseudo environment variables
	dotenv({ path: `${__dirname}/../.env` });

	// Setup the alsatian test runner
	const testRunner: TestRunner = new TestRunner();
	const tapStream: TestOutputStream = testRunner.outputStream;
	const testSet: TestSet = TestSet.create();
	const files: string = filename || join(__dirname, "../**/*.test.{ts,tsx}");
	testSet.addTestsFromFiles(files);

	// This will output a human readable report to the console.
	// TapBark has bad types or something. That's why these type casts are here. (tslint no-any catches it)
	const bark = <TapBark>TapBark.create();
	const barkTransform = <Duplex>bark.getPipeable();
	tapStream.pipe(barkTransform).pipe(process.stdout);

	// Runs the tests
	await testRunner.run(testSet);
}

if (require.main === module) {
	main().catch(error => {
		throw error;
	});
}
