import { Component, OnInit } from '@angular/core';
import { InstrumentsService } from '../_services/instruments.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit {

  // An array of all instrument objects from API
  public inventory;

  // An object representing the data in the 'add' form
  public new_instrument: any;

  // Api to hit
  private __url = 'http://localhost:8000/instruments/'

  constructor(private _instrumentService: InstrumentsService, private _userService: UserService) { }

  public getInstruments() {
    this._instrumentService.list().subscribe(
      // the first argument is a function which runs on success
      data => {
        this.inventory = data;
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading')
    );
  }

  ngOnInit() {
    this.getInstruments()
    this.new_instrument = {};
    //this.user = {
      //username: '',
      //password: ''
    //};
  }
}

export interface Instrument {
  kind: string;
  make: string;
  model: string;
  serial_number: string;
  uc_tag_number: string;
  uc_asset_number: string;
  condition: string;
}
