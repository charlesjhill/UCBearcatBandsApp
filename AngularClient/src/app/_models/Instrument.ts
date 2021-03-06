export class Instrument {

  public static possibleKinds: string[] = [
    'Alto Clarinet',
    'Alto Saxophone',
    'Baritone Saxophone',
    'Baritone',
    'Bass Clarinet',
    'Bass Trombone',
    'Bassoon',
    'Clarinet',
    'Cornet',
    'Eb Clarinet',
    'Electric Piano',
    'Electric Violin',
    'Euphonium',
    'Flute',
    'French Horn',
    'Marching Horn',
    'Mellophone',
    'Oboe',
    'Piano',
    'Piccolo',
    'Soprano Saxophone',
    'Sousaphone',
    'Tenor Saxophone',
    'Trombone',
    'Trumpet',
    'Tuba'
  ];


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
