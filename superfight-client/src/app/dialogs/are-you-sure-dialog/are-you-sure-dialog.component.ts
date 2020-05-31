import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'spf-are-you-sure-dialog',
  templateUrl: './are-you-sure-dialog.component.html',
  styleUrls: ['./are-you-sure-dialog.component.scss'],
})
export class AreYouSureDialogComponent implements OnInit {
  message = 'Are You Sure?';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data;
  }

  ngOnInit(): void {}
}
