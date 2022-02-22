declare var NL_VERSION: string;
declare var NL_NAME: string;
declare var NL_OS: string;
declare var NL_PORT: string;
declare var NL_MODE: string;
declare var NL_CWD: string;

declare namespace Neutralino {
    interface IDirectoryData {
        files: [{
            name: string;
            type: 'directory' | 'file';
        }]
    }
    interface IFilter {
        name: string;
        extensions: string[];
    }
    interface IOpenDialogOptions {
        filter: IFilter[];
        multiSelections?: boolean;
    }
    interface ISaveDialogOptions {
        filter: IFilter[];
        forceOverwrite?: boolean;
    }
    namespace filesystem {
        function createDirectory(dirName: string): Promise<void>;
        function removeDirectory(dirName: string): Promise<void>;
        function readDirectory(dirName: string): Promise<IDirectoryData>;
        function writeFile(filename: string, content: string): Promise<void>;
        function readFile(filename: string): Promise<string>;
        function removeFile(filename: string): Promise<void>;
    }
    namespace os {
        function showSaveDialog(title: string, options: ISaveDialogOptions): Promise<string | void>;
        function showFolderDialog(title: string): Promise<string | void>;
        function showOpenDialog(title: string, options: IOpenDialogOptions): Promise<string | void>;
    }
}