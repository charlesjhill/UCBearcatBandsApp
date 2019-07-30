export class Instrument {
  [x: string]: any; // added to do some hacky shit disregard this
  id: number;
  kind: string;
  make: string;
  model: string;
  serial_number: string;
  uc_tag_number: string;
  uc_asset_number: string;
  condition: string;
  name: string;
  locker: any; // number of locker instance
}
