import { Component, OnInit } from '@angular/core';
import { InventoryDocumentType } from 'src/app/shared/enums/invoices.enum';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
})
export class PurchaseInvoiceComponent {

  InventoryDocumentType = InventoryDocumentType;
}
