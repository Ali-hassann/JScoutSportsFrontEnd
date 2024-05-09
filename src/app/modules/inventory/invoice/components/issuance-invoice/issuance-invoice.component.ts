import { Component, OnInit } from '@angular/core';
import { InventoryDocumentType } from 'src/app/shared/enums/invoices.enum';

@Component({
  selector: 'app-issuance-invoice',
  template: '<app-invoice-list [InvoiceType]="InventoryDocumentType.Issuance"></app-invoice-list>',
})
export class IssuanceInvoiceComponent {

  InventoryDocumentType = InventoryDocumentType;
}
