export interface IToPlainObject {
    toPlainObject(): any;
}

export default class BackgroundWorker {
    
    public reportProgress(p: number | undefined){
        postMessage({key: 'progress', value: p});
    }
  
    public initWorker(workFn: (param: any) => Promise<IToPlainObject | IToPlainObject[] | undefined>) {
        self.addEventListener("message", async (event) => {
            postMessage({ key: "working", value: true });
            if(event.data) {
                try {
                const result = await workFn(event.data);
                let data = undefined;
                if (Array.isArray(result))
                    data = result.map(i => i.toPlainObject());
                else if(result != undefined)
                    data = result.toPlainObject()
                postMessage({key: 'result', value: data});
                } catch (e) {
                    postMessage({key: 'error', value: e});
                }
            }
            postMessage({ key: "working", value: false });
        });
    }
}

export class WorkerClient<T> {

    private worker!: Worker;
    private resolveFn: ((o: T) => void) | null = null;
    private rejectFn: ((err: any) => void) | null = null;

    public createWorker(module: string, fromPlainObjectFn: (o:any) => T = (o) => o as T, progressHandler: (b: boolean, p: number | undefined) => void = ()=>{}) {
        const w = new Worker(module, {type: "module"});

        const _this = this;

        w.onmessage = (ev: MessageEvent) => {
            if (ev.data.key == "working") {
            progressHandler(ev.data.value, undefined);
            } else if (ev.data.key == "progress") {
            progressHandler(true, ev.data.value);
            } else if (ev.data.key == "result"){
                _this.resolve(fromPlainObjectFn(ev.data.value));
            } else if (ev.data.key == "error"){
                _this.reject(ev.data.value);
            } 
        }
        this.worker = w;

        console.log(`[[WorkerClient]] Client created: ${module}`);
    }

    private clearPromiseFns(){
        if(this.resolveFn == null && this.rejectFn == null)
            return;
        this.resolveFn = null;
        this.rejectFn = null;
        
        console.log(`[[WorkerClient]] Promise functions cleared`);
    }

    private resolve(o: T){
        if( this.resolveFn == null)
            console.error("resolveFn null!", this);
        else {
            this.resolveFn(o);
            console.log(`[[WorkerClient]] Promise resolved`);
        }
        this.clearPromiseFns();
    }

    private reject(o: any, strict: boolean = true) {
        if( this.rejectFn == null)
            if(strict) 
                console.error("rejectFn null!", this);
            else 
                return;
        else{
            this.rejectFn(o);
            console.log(`[[WorkerClient]] Promise rejected:`, o);
        }
        this.clearPromiseFns();
    }

    public runWorker(params: any): Promise<T> {
        const _this = this;
        setTimeout(()=> {
                _this.reject("Timeout", false);
        }, 5000);
        const p = new Promise<T>((res, rej) => {
            console.log("[[WorkerClient]] New promise");

            _this.resolveFn = res;
            _this.rejectFn = rej;
            _this.worker.postMessage(params);
        });
        
        return p;
    }
}