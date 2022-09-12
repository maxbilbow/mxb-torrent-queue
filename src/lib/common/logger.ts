import { Logger } from "tslog";
export const VERBOSE = process.argv.includes('--verbose');
export function getLogger(name: string) {
    return new Logger({
        name,
        minLevel: VERBOSE ? 'debug' : 'info'
    })
} 