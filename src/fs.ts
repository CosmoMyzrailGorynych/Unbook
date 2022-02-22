const writeFile = Neutralino.filesystem.writeFile;
const readFile = Neutralino.filesystem.readFile;
const readJSON = async function(filename: string): Promise<any> {
    return JSON.parse(await readFile(filename));
}
const writeJSON = async function(filename: string, json: any) {
    await writeFile(filename, JSON.stringify(json, null, 2));
}
export {
    writeFile,
    readFile,
    readJSON,
    writeJSON
};