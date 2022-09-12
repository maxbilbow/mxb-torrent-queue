#!/usr/bin/env node

import { homedir } from 'os';
import path from 'path';
import getDefaultOptions from '../lib/common/get-default-options';
import { add, poll } from '../lib/queue-manager';

const options = getDefaultOptions()
    .command('start', 'Start torrent queue', {}, () => poll())
    .command('stop', 'Stop torrent queue', {}, (argv) => console.log('STOP', argv))
    .command({
        command: 'add <torrent>',
        describe: 'Add a torrent',
        builder: yargs => yargs
            .positional('torrent', {
                type: 'string',
                description: 'Torrent URL or Magnet Link',
                demandOption: true
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
        handler: ({ writeTo, torrent, start }) => {
            add({ writeTo, torrent })
            if (start) {
                return poll();
            }
        }
    })
    .strict()
    .help()
    .parse()