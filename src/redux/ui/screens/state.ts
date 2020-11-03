import { IScreenDataState } from './data/state';
import { IPosActionsState } from './posActions/state';

export interface IScreensState {
    posActions: IPosActionsState;
    data: IScreenDataState;
}
