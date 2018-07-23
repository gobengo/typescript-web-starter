/**
 * Script to run web server
 */
import { createServer, Server } from "http";
import killable = require("killable") // tslint:disable-line:no-require-imports
import { TypescriptWebStarterApp } from '../client/components/apps/TypescriptWebStarterApp';
import { log } from "../log";
import { AppsWebServer } from "../server";

const serverUrl = (server: Server): string => {
	const address = server.address();
	if (typeof address === "string") {
		return address;
	}
	const host: string = address.address === "::" ? "localhost" : address.address;

	// tslint:disable-next-line:no-http-string
	return `http://${host}:${address.port}`;
};

// const waitForServerClose = async (server: Server) => {
// 	await new Promise((resolve, reject) => {
// 		try {
// 			server.once("close", () => {
// 				log("debug", "server closed");
// 				resolve();
// 			});
// 		} catch (error) {
// 			reject(error)
// 		}
// 	});
// };

const processSignal = async (signal: NodeJS.Signals) => {
	await new Promise((resolve, reject) => {
		try {
			process.once(signal, resolve)
		} catch (error) {
			reject(error)
		}
	})
}

const killServerOnProcessInterupt = async (process: NodeJS.Process, killableServer: killable.KillableServer): Promise<void> => {
	await processSignal("SIGINT")
	log("warn", "SIGINT");
	log("debug", "killing web server")
	await new Promise((resolve, reject) => {
		try {
			killableServer.kill(resolve)
		} catch (error) { reject(error) }
	})
};

const listen = async (server: Server, port:string|number) => {
	return new Promise((resolve, reject) => {
		server.listen(port, (err: Error) => {
			if (err) {
				reject(err)
				return
			}
			resolve()
		})
	});
}

const main = async () => {
	const appsServer = AppsWebServer(TypescriptWebStarterApp, {
		dev: process.env.NODE_ENV === "development",
	});
	const httpServer: killable.KillableServer = killable(createServer(appsServer.createRequestListener()))
	await listen(httpServer, process.env.PORT || 8000);
	log("info", `Listening at ${serverUrl(httpServer)}`);
	await killServerOnProcessInterupt(process, httpServer)
	process.exit()
};

if (require.main === module) {
	main().catch((e: Error) => {
		throw e;
	});
}
