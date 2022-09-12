#!/usr/bin/env node

import { homedir } from 'os';
import path from 'path';
import getDefaultOptions from '../lib/common/get-default-options';

const options = getDefaultOptions()
    .command('start', 'Start torrent queue', {}, (argv) => console.log('START', argv))
    .command('stop', 'Stop torrent queue', {}, (argv) => console.log('START', argv))
    .command({
        command: 'add <torrent>',
        describe: 'Add a torrent',
        builder: yargs => yargs
            .positional('torrent', {
                type: 'string',
                description: 'Torrent URL or Magnet Link'
            })
            .option('start', {
                alias: 's',
                description: 'Start queue'
            })
            .option('write-to', {
                alias: 'w',
                description: "Save torrent to folder",
                default: path.join(homedir(), 'Videos')
            })
        ,
        handler: (argv) => console.log('ADD ADD ADD!!!', argv)
    })
    .strict()
    .help()
    .parse()

// console.log('DEFAULT', options)