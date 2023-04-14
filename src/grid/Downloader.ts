import { FileDownload } from "capacitor-plugin-filedownload"
import { Device } from "@capacitor/device"

export default class Downloader {
    public async download(content: string | Blob, fileName: string){
        const d = await Device.getInfo();
        if (d.platform == "web") {
            this.downloadWeb(content, fileName);
        } else {
            this.downloadCap(content, fileName);
        }
    }

    private downloadCap(content: string | Blob, fileName: string){
        
        const uri = this.getUri(content);
        FileDownload.download({
            uri,
            fileName,
            // // only works on Android
            // downloadTitle: 'downloading',
            // downloadDescription: 'file is downloading',
            })
    }
    
    private downloadWeb(content: string | Blob, fileName: string){
        const element = document.createElement('a');
        
        const uri = this.getUri(content);
        element.setAttribute('href', uri);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    private getUri(content: string | Blob) {
        return content.constructor.name == 'Blob'
            ? window.URL.createObjectURL(content as Blob)
            : 'data:text/plain;charset=utf-8,' + encodeURIComponent(content as string);
    }
}