import { rejects } from "assert";
import { spawn } from "cross-spawn";
import { resolve } from "path";
import { getLogger } from "./common/logger";

interface Options {
    torrent: string;
    writeTo: string;
}

export default function runTransmissionCli({ torrent, writeTo }: Options): Promise<boolean> {
    return new Promise((resolve) => {
        const logger = getLogger("runTransmissionCli");
        logger.info(`Downloading to ${writeTo}`);
        const transmission = spawn('transmission-cli', ['-w', writeTo, torrent]);
        
        transmission.stdout.on('data', (data: Buffer) => {
            const s = data.toString("utf-8")
            if (s.includes("seeding")) {
                logger.info(s)
                transmission.kill();
                resolve(true);
            } else if (s.includes("%")) {
                logger.info(s);
            } else {
                logger.debug(s);
            }
        });

        transmission.stdout.on('exit', (code) => {
            logger.info(`transmission-cli exited with code ${code}`);
            resolve(false);
        });

        transmission.stdout.on('error', (err) => {
            logger.error(err);
            resolve(false);
        });
    });
}