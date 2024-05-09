import { Component, OnInit } from '@angular/core';
import { InventoryDocumentType } from 'src/app/shared/enums/invoices.enum';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
})
export class PurchaseReturnComponent {
  InventoryDocumentType = InventoryDocumentType;

}
