import { Low } from 'lowdb';
import UniversalFsAdapter from './lowDbFsAdapter';
import cumulativeDelayed from './cumulativeDelayed';
import { i18n } from './i18n';
import { writable } from 'svelte/store';
import { keys, getMany, setMany } from 'idb-keyval';

type AttachmentData = {
    title: string;
    data64: string;
}
type PageData = {
    title: string;
    blocks: EditorJS.OutputData;
}
type UnbookData = {
    pages: Record<string, PageData>;
    attachments: Record<string, AttachmentData>;
    emoji: string;
}

const getUnbooksPaths = async function (): Promise<string[]> {
    if (window.NL_NAME) {
        return JSON.parse((localStorage as LocalSettings).unbooks);
    }
    // Rediscover all the valid keys in an indexedDb
    const allKeys = (await keys()).filter(key => String(key).startsWith('unbook')) as string[];
    return allKeys;
};

class Unbook {
    data: UnbookData;
    dbPath: string;
    adapter: UniversalFsAdapter<UnbookData>;
    db: Low<UnbookData>;
    #delayedSave: Function;
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.adapter = new UniversalFsAdapter<UnbookData>(this.dbPath);
        this.db = new Low<UnbookData>(this.adapter);
        this.#delayedSave = cumulativeDelayed(this.saveImmediately, 5000);
        this.load();
    }
    rescheduleSave() {
        this.#delayedSave();
    }
    saveImmediately() {
        return this.db.write();
    }
    async load() {
        if (this.data) {
            return;
        }
        await this.db.read();
        this.data ||= {
            emoji: '📔',
            pages: {
                root: {
                    title: i18n('Unbook')().newUnbookTitle,
                    blocks: {
                        time: Number(new Date()),
                        blocks: []
                    }
                }
            },
            attachments: {}
        };
    }
}

const openedUnbooksPaths = writable<string[]>([]);
const openedUnbooks = writable<Unbook[]>([]);
getUnbooksPaths().then(async paths => {
    let oldUnbooks = paths;
    if (window.NL_NAME) {
        const unbooksPathPairs = (await getMany(paths)).map((unbook, i) => [paths[i], unbook] as [string, string]);
        setMany(unbooksPathPairs);
    }
    openedUnbooksPaths.subscribe(async newUnbooks => {
        const deleted = oldUnbooks.filter(unbook => !newUnbooks.includes(unbook));
        const created = newUnbooks.filter(unbook => !oldUnbooks.includes(unbook));
        if (window.NL_NAME) {
            (localStorage as LocalSettings).unbooks = JSON.stringify(newUnbooks);
        }
        if (deleted.length || created.length) {
            openedUnbooks.update(unbooks => {
                for (const deletedUnbook of deleted) {
                    const id = unbooks.findIndex(unbook => unbook.dbPath === deletedUnbook);
                    unbooks.splice(id, 1);
                }
                for (const createdUnbook of created) {
                    const newUnbook = new Unbook(createdUnbook);
                    unbooks.push(newUnbook);
                }
                return unbooks;
            });
        }
    });
});

export {
    openedUnbooksPaths,
    openedUnbooks,
    getUnbooksPaths,
    Unbook
};
