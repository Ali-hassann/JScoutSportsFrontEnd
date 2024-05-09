import { Component, OnInit } from '@angular/core';
import { InventoryDocumentType } from 'src/app/shared/enums/invoices.enum';

@Component({
  selector: 'app-adjustment',
  templateUrl: './adjustment.component.html',
  styleUrls: ['./adjustment.component.scss']
})
export class AdjustmentComponent {

  InventoryDocumentType = InventoryDocumentType;

}
