import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IBloodPress {
    id?: number;
    timestamp?: Moment;
    systolic?: number;
    diastolic?: number;
    user?: IUser;
}

export class BloodPress implements IBloodPress {
    constructor(public id?: number, public timestamp?: Moment, public systolic?: number, public diastolic?: number, public user?: IUser) {}
}
