export abstract class BaseProvider {
    abstract async rpc(method: string, params: any[]): Promise<any>;
}
