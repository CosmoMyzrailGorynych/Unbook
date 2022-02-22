<template lang="pug">
    .aButtonStack.huge
        button(on:click="{createNewUnbook}")
            Icon(i="plus")
            span {voc().createNew}
        button(on:click="{openExistingUnbook}")
            Icon(i="folder")
            span {voc().addExisting}
</template>

<script lang="ts">
    import Icon from './Icon.svelte';
    import {i18n} from './i18n';
    export const voc = i18n('AddBookModal');
    export const vocCommon = i18n('common');

    import {Unbook, openedUnbooksPaths} from './UnbookAPI';
    import {nanoid} from 'nanoid';
    import {loadFile} from './dialogs';

    export const createNewUnbook = () => {
        let path;
        if (window.NL_NAME) {
            path = Neutralino.os.showSaveDialog(this.voc().saveUnbookToTitle, {
                filter: [{
                    name: this.vocCommon().unbooks as string,
                    extensions: ['unbook']
                }]
            });
            if (!path) {
                return;
            }
        } else {
            path = nanoid();
        }
        const unbook = new Unbook(path);
        openedUnbooksPaths.update(oldUnbooks => [...oldUnbooks, path]);
    };
    export const openExistingUnbook = async () => {
        let {path} = await loadFile({
            title: this.voc().selectUnbookTitle,
            filter: [{
                name: this.vocCommon().unbooks,
                extensions: ['unbook']
            }]
        });
        if (window.NL_NAME) {
            new Unbook(path);
            openedUnbooksPaths.update(oldUnbooks => [...oldUnbooks, path]);
        }
    };
</script>