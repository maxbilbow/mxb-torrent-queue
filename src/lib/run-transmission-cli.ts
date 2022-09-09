import { exec, execSync, spawn } from "child_process";
import { getLogger } from "./common/logger";

interface Options {
    torrentUrl: string;
    downloadPath: string;
}

const logger = getLogger("runTransmissionCli");
export default function runTransmissionCli({downloadPath, torrentUrl}: Options) {
    const transmission = spawn('transmission-cli', ['-w', downloadPath, torrentUrl]);
    
    transmission.stdout.on('data', (data) => {
        if (data.includes("seeding")) {
            transmission.kill();
        }
    });
    
    transmission.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    transmission.on('close', (code) => {
      console.log(`transmission-cli exited with code ${code}`);
    });
}