/**
 * index file for src/client
 */

const main = async () => {
	const { log } = await import("../log");
	log("info", "nothing to show for this ./src/client module");
};

if (require.main === module) {
	main().catch((error: Error) => {
		throw error;
	});
}
