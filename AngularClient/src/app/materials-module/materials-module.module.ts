import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// All the Matierals
// tslint:disable-next-line: max-line-length
import { MatButtonModule, MatCheckboxModule, MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, MatRippleModule, MatDialogModule, MatExpansionModule } from '@angular/material';
import { MatFormFieldModule, MatCardModule, MatGridListModule, MatInputModule, MatTableModule } from '@angular/material';

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
    MatExpansionModule
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
    MatExpansionModule
  ]
})
export class MaterialsModule { }
