import { Logger } from "tslog";
const VERBOSE = process.argv.includes('--verbose');
export function getLogger(name: string) {
    return new Logger({
        name,
        minLevel: VERBOSE ? 'silly' : 'info'
    })
} 