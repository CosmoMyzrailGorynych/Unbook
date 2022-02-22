const i18nFilesDir = 'data/i18n';
import { readJSON } from './fs';

const settings = localStorage as LocalSettings;
var languageJSON = readJSON(`${i18nFilesDir}/${settings.language || 'English'}.json`);

const getVoc = (namespace: string) => {
    return function () {
        return languageJSON[namespace];
    }
}

export {
    getVoc as i18n
};