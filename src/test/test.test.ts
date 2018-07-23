import { AsyncTest, Expect, TestCase, TestFixture } from "alsatian";
import { cli } from "./cli";

/**
 * Sample tests to prove that testing works
 */
@TestFixture("Testing the Test Framework")
export class TestAddition {
	// tslint:disable-line:export-name
	/** Test a simple addition function */
	@TestCase(2, 2, 4)
	@TestCase(2, 3, 5)
	@TestCase(3, 3, 6)
	@AsyncTest("addition tests")
	public async addTest(
		firstNumber: number,
		secondNumber: number,
		expectedSum: number,
	): Promise<void> {
		Expect(firstNumber + secondNumber).toBe(expectedSum);
	}
}

if (require.main === module) {
	cli(__filename).catch(error => {
		throw error;
	});
}
