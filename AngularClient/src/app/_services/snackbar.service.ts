import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackbar: MatSnackBar) { }

  /** Open a snackbar with some particular settings */
  public openSnackBar(message: string, action?: string, duration?: number): MatSnackBarRef<any> {
    duration = duration || 2000;
    action = action || '';
    return this.snackbar.open(message, action, {
      duration
    });
  }

  /** Open a snackbar specifically for deleting */
  public openDeleteSnackBar(message: string, action?: string, duration?: number): MatSnackBarRef<any> {
    duration = duration || 2000;
    action = action || '';
    return this.snackbar.open(message, action, {
      duration,
      panelClass: ['myapp-danger-background-snackbar']
    });
  }
}
