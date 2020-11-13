import { IScreenDataState } from './data/state';
import { IScreenInputState } from './input-data/state';
import { IPosActionsState } from './posActions/state';

export interface IScreensState {
    posActions: IPosActionsState;
    data: IScreenDataState;
    inputData: IScreenInputState;
}
