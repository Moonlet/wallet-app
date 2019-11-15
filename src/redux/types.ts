export interface IAction<D = any> {
    type: string;
    data?: D;
    inProgress?: boolean;
    error?: any;
}
