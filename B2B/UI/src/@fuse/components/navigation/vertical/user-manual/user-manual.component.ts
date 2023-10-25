import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseVerticalNavigationComponent } from '../vertical.component';

@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.scss']
})
export class UserManualComponent {
  fileUrl = "../../../../assets/pdf/32074.pdf"
  constructor( private dialogRef: MatDialogRef<FuseVerticalNavigationComponent>) { }
  zoom = 1
  
  closeDialog(){
    this.dialogRef.close();
  }
  zoomIn(){
    this.zoom += 0.25
  }
  zoomOut(){
    this.zoom -= 0.25
  }
}
