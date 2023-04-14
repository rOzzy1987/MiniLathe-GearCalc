import { Device } from "@capacitor/device"

export class DeviceHelper {
    public static async isNativeApp(){
        const i = await Device.getInfo();
        return i.platform != "web";
    }
}