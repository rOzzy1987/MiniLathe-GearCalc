import { Downloader, type IDownloaderImpl, WebDownloaderImpl } from "@rozzy/vue-datagrid/src/Downloader" 
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from "@capacitor/share"
import { DeviceHelper } from "@/bll/device";

class MobileNativeDownloaderImpl implements IDownloaderImpl {
    public async download(content: string | Blob, fileName: string): Promise<void>{
        console.log("mobile download");
        const newFilename = await this.getActualFilename(fileName);
        if (newFilename == null)
            return; 
        const result = await Filesystem.writeFile({
            path: newFilename,
            data: await this.getContent(content),
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
            });

        if(result.uri != undefined && await Share.canShare()){
            const fileInfo = await Filesystem.getUri({path: newFilename, directory: Directory.Documents})
            
            const shareResult = await Share.share({files: [fileInfo.uri]});
            console.info(`shared ${result.uri}`, shareResult);
        }
    }

    private async getActualFilename(fileName: string) {
        const dir = await Filesystem.readdir({directory: Directory.Documents, path: "." });
        if(dir.files.every(f => f.name != fileName))
            return fileName;

        const i = fileName.lastIndexOf('.');
        const name = i == -1 ? fileName : fileName.substring(0, i);
        const ext = i == -1 ? '' : fileName.substring(i+1);

        for(let c = 1; c < 100; c++){
            const newName = `${name}${c}.${ext}`;
            if(dir.files.every(f => f.name != newName))
                return newName;
        }
        return null;
    }

    private async getContent(content: string | Blob){
        return content.constructor.name == 'Blob'
            ? (content as Blob).text()
            : content as string;
    }
}

abstract class GCDownloaderBase extends Downloader {
    protected async getImpl(): Promise<IDownloaderImpl> {
        if (this._impl == null)
            this._impl = !(await DeviceHelper.isNativeApp())
                ? new WebDownloaderImpl()
                : new MobileNativeDownloaderImpl();
        return this._impl;
    } 
}

export default class GCDownloader extends GCDownloaderBase {
    public async download(content: string | Blob, fileName: string){
        (await this.getImpl()).download(content, fileName);
    }

}
