export interface IToPlainObject {
    toPlainObject(): any;
}

export default class BackgroundWorker {
    
    public reportProgress(p: number | undefined){
        postMessage({key: 'progress', value: p});
    }
  
    public initWorker(workFn: (param: any) => Promise<IToPlainObject | IToPlainObject[] | undefined>) {
        self.addEventListener("message", async (event) => {
            const params = event.data.params;
            const id = event.data.id;
            postMessage({ key: "working", id, value: true });
            try {

                const result = await workFn(params);
                let data = undefined;
                if (Array.isArray(result))
                    data = result.map(i => i.toPlainObject());
                else if(result != undefined)
                    data = result.toPlainObject()
                postMessage({key: 'result', id, value: data});
            } catch (e) {
                postMessage({key: 'error', id, value: e});
            }
            postMessage({ key: "working", id, value: false });
        });
    }
}

export class WorkerClient<T> {
    private static _workers: any = {};
    private static _requests: any = {};

    private worker!: Worker;

    public createWorker(module: string, fromPlainObjectFn: (o:any) => T = (o) => o as T, progressHandler: (b: boolean, p: number | undefined) => void = ()=>{}) {
        if (WorkerClient._workers[module] == undefined) {
            const w = new Worker(module, {type: "module"});

            const _this = this;

            w.onmessage = (ev: MessageEvent) => {
                if (ev.data.key == "working") {
                progressHandler(ev.data.value, undefined);
                } else if (ev.data.key == "progress") {
                progressHandler(true, ev.data.value);
                } else if (ev.data.key == "result"){
                    _this.resolve(ev.data.id, fromPlainObjectFn(ev.data.value));
                } else if (ev.data.key == "error"){
                    _this.reject(ev.data.id, ev.data.value);
                } 
            }
            WorkerClient._workers[module] = w;
        }
        this.worker = WorkerClient._workers[module];

        console.log(`[[WorkerClient]] Client created: ${module}`);
    }

    private clearPromiseFns(id: string){
        WorkerClient._requests[id] = undefined;
        
        console.log(`[[WorkerClient]] Promise functions cleared`);
    }

    private resolve(id: string, result: T){
        const o = WorkerClient._requests[id];
        if (o == undefined) {
            console.error("resolveFn null!", WorkerClient._requests, id);
        } else {
            o.resolve(result);
        }
        this.clearPromiseFns(id);
    }

    private reject(id: string, reason: any, strict: boolean = true) {
        const o = WorkerClient._requests[id];
        if (o == undefined)
            if(strict) 
                console.error("rejectFn null!", WorkerClient._requests, id);
            else 
                return;
        else{
            o.reject(reason);
            console.log(`[[WorkerClient]] Promise rejected:`, reason);
        }
        this.clearPromiseFns(id);
    }

    public runWorker(params: any): Promise<T> {
        const _this = this;
        let id: string;
        do {
            id = `req-id-${Math.round(Math.random()*100000)}`;
        } while (id in WorkerClient._requests);

        setTimeout(()=> {
                _this.reject(id, "Timeout", false);
        }, 5000);
        const p = new Promise<T>((resolve, reject) => {

            WorkerClient._requests[id] = {resolve, reject}
            console.log(`[[WorkerClient]] New promise: ${id}`);

            _this.worker.postMessage({id, params});
        });
        
        return p;
    }
}