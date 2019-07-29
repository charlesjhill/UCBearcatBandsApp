import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// All the Matierals
// tslint:disable-next-line: max-line-length
import { MatButtonModule, MatCheckboxModule, MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, MatRippleModule, MatDialogModule, MatExpansionModule, MatMenuModule, MatSortModule } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { MatFormFieldModule, MatCardModule, MatGridListModule, MatInputModule, MatTableModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatGridListModule,
    MatRippleModule,
    MatTableModule,
    MatDialogModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatMenuModule,
    MatSortModule,
    MatSnackBarModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatGridListModule,
    MatRippleModule,
    MatTableModule,
    MatDialogModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatMenuModule,
    MatSortModule,
    MatSnackBarModule
  ]
})
export class MaterialsModule { }
