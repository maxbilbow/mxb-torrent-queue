import exp from "constants";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { homedir } from "os";
import path from "path";
import { getLogger } from "./common/logger";
import runTransmissionCli from "./run-transmission-cli";

interface QueueEntry {
    torrent: string;
    writeTo: string;
}

const CFG_FIR = path.join(homedir(), '.mxb')
const QUEUE_FILE = path.join(CFG_FIR, 'queue.json')
const logger = getLogger('QueueManager')

export function add(entry: QueueEntry) {
    const queue = getQueue();
    queue.push(entry);
    writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), "utf-8");
}

export async function poll() {
    logger.info('Getting next entry');
    const entry = next();
    if (!entry) {
        logger.info('Queue is empty; Stoppng service.');
        return;
    }

    if (await runTransmissionCli(entry)) {
        logger.info('Download succeeded; removing from queue')
        remove(entry);
        poll()
    } else {
        logger.warn('Download failed.')
    }
}

function next(): QueueEntry | undefined {
    return getQueue()[0]
}

function remove(entry: QueueEntry) {
    const queue = getQueue()
        .filter(({ writeTo, torrent }) => !(torrent === entry.torrent && writeTo === entry.writeTo));

    writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), "utf-8");
}

function getQueue(): QueueEntry[] {
    if (!existsSync(QUEUE_FILE)) {
        mkdirSync(QUEUE_FILE, { recursive: true })
        writeFileSync(QUEUE_FILE, '[]', "utf-8");
    }
    return require(QUEUE_FILE);
}