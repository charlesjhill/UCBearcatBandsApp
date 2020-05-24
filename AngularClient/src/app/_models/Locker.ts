import type { Instrument } from 'src/app/_models';
export class Locker {
    id: number;
    number: number;
    combination: string;
    assets: Array<number | Instrument>;
}