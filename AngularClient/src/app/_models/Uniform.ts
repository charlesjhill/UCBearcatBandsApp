import type { Locker } from '.';

export class Uniform {
  id: number;
  kind: string;
  condition: string;
  size: string;
  number: string;
  name: string;
  locker: number | Locker;
}
