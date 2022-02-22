import { readJSON, writeJSON } from './fs';
import { set as setIDB, get as getIDB } from 'idb-keyval';

class UniversalFsAdapter<T> {
    #fsPath: string;
    // Optional: your adapter can take arguments
    constructor(path: string) {
        this.#fsPath = path;
    }
    async read(): Promise<T> {
        if (window.NL_NAME) {
            const data = await readJSON(this.#fsPath);
            return data as T;
        }
        return JSON.parse(await getIDB(this.#fsPath));
    }
    async write(data: T) {
        if (window.NL_NAME) {
            await writeJSON(this.#fsPath, data);
            return;
        }
        await setIDB(this.#fsPath, JSON.stringify(data));
    }
}

export default UniversalFsAdapter;