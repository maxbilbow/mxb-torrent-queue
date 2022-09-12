import { Logger } from "tslog";
import getDefaultOptions, { DefaultOptions } from "./get-default-options";
const VERBOSE = (getDefaultOptions().argv as DefaultOptions).verbose;
export function getLogger(name: string) {
    return new Logger({
        name,
        minLevel: VERBOSE ? 'silly' : 'info'
    })
} 