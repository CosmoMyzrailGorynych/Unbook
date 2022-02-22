<template lang="pug">
    ul
        +each('unbooks as unbook')
            li(on:click="{openUnbook(unbook)}")
                +await('unbook.load()')
                    icon(i="spinner")
                        span Loading…
                    +then('o')
                        span {unbook.data.pages.root.title}
                    +catch('e')
</template>

<script lang="ts">
    import Icon from './Icon.svelte';
    import {i18n} from './i18n';
    import {Unbook} from './UnbookAPI';
    console.log(Unbook); // TODO:
    export const voc = i18n('UnbooksList');
    import {openedUnbooks} from './UnbookAPI';
    export let unbooks: Unbook[] = [];
    openedUnbooks.subscribe(newUnbooks => {
        unbooks = newUnbooks;
    })
    import {loadFile} from './dialogs';
</script>