import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackbar: MatSnackBar) { }

  public openSnackBar(message: string, action?: string, duration?: number): MatSnackBarRef<any> {
    duration = duration || 2000;
    action = action || '';
    return this.snackbar.open(message, action, {
      duration
    });
  }

  public openDeleteSnackBar(message: string, action?: string, duration?: number): MatSnackBarRef<any> {
    duration = duration || 2000;
    action = action || '';
    return this.snackbar.open(message, action, {
      duration,
      panelClass: ['myapp-danger-background-snackbar']
    });
  }
}
