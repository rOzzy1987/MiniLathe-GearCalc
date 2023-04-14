import { Preferences } from "@capacitor/preferences"
import { DeviceHelper } from "./device";

interface IStorage {
    getValue(key: string): Promise<string | null>;
    setValue(key: string, value: string): Promise<any>;
    removeValue(key: string): Promise<any>;
    clear(): Promise<any>;
}
interface IStorageImpl extends IStorage {
}

class LocalStorageStorageImpl implements IStorageImpl {
    clear(): Promise<any> {
        return new Promise(resolve => resolve(localStorage.clear()));
    }
    removeValue(key: string): Promise<any> {
        return new Promise(resolve => resolve(localStorage.removeItem(key)));
    }
    getValue(key: string): Promise<string | null> {
        return new Promise((resolve) => resolve(localStorage.getItem(key)))
    }
    setValue(key: string, value: string): Promise<any> {
        return new Promise(resolve => resolve(localStorage.setItem(key, value)));
    }
}

class CapacitorPreferencesStorageImpl implements IStorageImpl {
    async getValue(key: string): Promise<string | null> {
        return (await Preferences.get({key})).value;
    }
    async setValue(key: string, value: string): Promise<any> {
        await Preferences.set({key, value});
    }
    async removeValue(key: string): Promise<any> {
        await Preferences.remove({key});
    }
    async clear(): Promise<any> {
        await Preferences.clear();
    }
}

abstract class StorageBase {
    private _impl: IStorageImpl | null = null;
    protected async getImpl() {
        if (this._impl == null)
            this._impl = await DeviceHelper.isNativeApp() 
                ? new CapacitorPreferencesStorageImpl() 
                : new LocalStorageStorageImpl();
        return this._impl;
    }
}

export class Storage extends StorageBase implements IStorage{
    async getValue(key: string): Promise<string | null> {
        return await (await this.getImpl()).getValue(key);
    }
    async setValue(key: string, value: string): Promise<any> {
        return await (await this.getImpl()).setValue(key, value);
    }
    async removeValue(key: string): Promise<any> {
        return await (await this.getImpl()).removeValue(key);
    }
    async clear(): Promise<any> {
        return await (await this.getImpl()).clear();
    }
}