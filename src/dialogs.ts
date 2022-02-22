import { writeFile, readFile, writeJSON, readJSON } from './fs';

const saveAsFile = async function (
    fileData: string,
    dialogOptions: {
        defaultName: string,
        title: string,
        filter: Neutralino.IFilter[]
    }
): Promise<void> {
    if (window.NL_NAME) {
        const filePath = await Neutralino.os.showSaveDialog(dialogOptions.title, {
            filter: dialogOptions.filter
        });
        if (filePath) {
            await writeFile(filePath, fileData);
        }
    }
};

const loadFile = async function (dialogOptions: {
    title: string,
    filter: Neutralino.IFilter[]
}): Promise<{
    path: string,
    data: string
}> {
    if (window.NL_NAME) {
        const filePath = await Neutralino.os.showOpenDialog(dialogOptions.title, {
            filter: dialogOptions.filter
        });
        if (!filePath) {
            return;
        }
        return {
            path: filePath,
            data: await readFile(filePath)
        };
    }
};

const saveAsJSON = function (
    fileData: object,
    dialogOptions: {
        defaultName: string,
        title: string,
        filter: Neutralino.IFilter[]
    }
) {
    return saveAsFile(JSON.stringify(fileData, null, 2), dialogOptions);
};

const loadJSON = async function (dialogOptions: {
    title: string,
    filter: Neutralino.IFilter[]
}): Promise<{
    path: string,
    data: object
}> {
    const result = await loadFile(dialogOptions);
    if (result) {
        return {
            data: JSON.parse(result.data),
            path: result.path
        }
    }
};

export {
    saveAsFile,
    loadFile,
    saveAsJSON,
    loadJSON
}