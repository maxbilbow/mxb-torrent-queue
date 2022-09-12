import { spawn } from "child_process";
import { getLogger } from "./common/logger";

interface Options {
    torrentUrl: string;
    downloadPath: string;
}

const logger = getLogger("runTransmissionCli");
export default function runTransmissionCli({ downloadPath, torrentUrl }: Options) {
    const transmission = spawn('transmission-cli', ['-w', downloadPath, torrentUrl]);

    transmission.stdout.on('data', (data) => {
        if (data.toString().includes("seeding")) {
            transmission.kill(0);
        } else if (data.toString().includes("%")) {
            logger.info(data);
        } else {
            logger.debug(data);
        }
    });

    transmission.stdout.on('exit', (code) => {
        logger.info(`transmission-cli exited with code ${code}`);
    });

    transmission.stdout.on('error', (err) => {
        logger.error(err);
    });
}