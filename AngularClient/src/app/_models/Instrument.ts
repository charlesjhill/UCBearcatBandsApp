import type { Locker } from '.';

export class Instrument {

  /** A list of the possible kinds of Instruments we can have. TODO: Fetch these from the server */
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
    'Tuba',
    'Valved Trombone'
  ];

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
