export interface IAction<D = any> {
    payload?: any;
    type: string;
    data?: D;
    inProgress?: boolean;
    error?: any;
}
