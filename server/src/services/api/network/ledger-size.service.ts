import { LOG_ERR, minutesToMs } from '@app/services';
import { AppCache, LEDGER_LOCATION } from '@app/config';
import { LedgerSizeDto } from '@app/types';
import {LEDGER_SIZE_CACHE_KEY} from "../../../config/cache-keys";

const getSize = require('get-folder-size');

/** Calculates ledger size. Requires the LEDGER_LOCATION app config variable is set & directory is readable. */
const getLedgerSizePromise = async (): Promise<LedgerSizeDto> =>
    new Promise((resolve, reject) => {
        getSize(LEDGER_LOCATION, (err, size) => {
            if (err) {
                LOG_ERR('getNodeStats.getLedgerSize', err);
                return reject({ error: 'Unable to read ledger size' });
            }
            console.log('not using cache');
            const ledgerSizeMb = Number((size / 1000 / 1000).toFixed(2));
            AppCache.temp.put(LEDGER_SIZE_CACHE_KEY, ledgerSizeMb, minutesToMs(10));
            return resolve({ ledgerSizeMb });
        });
    });

export const getLedgerSize = (res): void => {
    getLedgerSizePromise()
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send(err));
};