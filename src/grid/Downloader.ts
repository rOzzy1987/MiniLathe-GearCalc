
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Device } from "@capacitor/device"

export default class Downloader {
    public async download(content: string | Blob, fileName: string){
        const d = await Device.getInfo();
        if (d.platform == "web") {
            await this.downloadWeb(content, fileName);
        } else {
            await this.downloadCap(content, fileName);
        }
    }

    private async downloadCap(content: string | Blob, fileName: string){
        const newFilename = await this.getActualFilename(fileName);
        if (newFilename == null)
            return; 
        Filesystem.writeFile({
            path: newFilename,
            data: await this.getContent(content),
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
            });
    }
    
    private async downloadWeb(content: string | Blob, fileName: string){
        const element = document.createElement('a');
        
        const uri = this.getUri(content);
        element.setAttribute('href', uri);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    private async getActualFilename(fileName: string) {

        return fileName;
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
            : 'data:text/plain;charset=utf-8,' + encodeURIComponent(content as string);
    }

    private getUri(content: string | Blob) {
        return content.constructor.name == 'Blob'
            ? window.URL.createObjectURL(content as Blob)
            : 'data:text/plain;charset=utf-8,' + encodeURIComponent(content as string);
    }
}
