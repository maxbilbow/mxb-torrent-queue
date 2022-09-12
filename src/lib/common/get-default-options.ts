import yargs, { Argv } from "yargs";

export interface DefaultOptions {
    verbose: boolean;
}
export default function getDefaultOptions<T extends DefaultOptions>(yArgs = yargs): Argv<T> {
    return yArgs.option("verbose", {
        type: 'string',
        default: false
    }) as Argv<T>;
}