export class USB {
    public static async get(): Promise<Transport> {
        return;
    }

    public static async scan(callback: (event: { name: string; data?: any }) => any): Promise<any> {
        return;
    }

    public static async connect(device): Promise<Transport> {
        return;
    }
    public static async requestPermissions(): Promise<boolean> {
        return false;
    }
}
