import { spawn } from "cross-spawn";
import { getLogger } from "./common/logger";

interface Options {
    torrentUrl: string;
    downloadPath: string;
}

const logger = getLogger("runTransmissionCli");
export default function runTransmissionCli({ downloadPath, torrentUrl }: Options) {
    const transmission = spawn('transmission-cli', ['-w', downloadPath, torrentUrl]);

    transmission.stdout.on('data', (data: Buffer) => {
        const s = data.toString("utf-8")
        if (s.includes("seeding")) {
            transmission.kill(0);
        } else if (s.includes("%")) {
            logger.info(s);
        } else {
            logger.debug(s);
        }
    });

    transmission.stdout.on('exit', (code) => {
        logger.info(`transmission-cli exited with code ${code}`);
    });

    transmission.stdout.on('error', (err) => {
        logger.error(err);
    });
}