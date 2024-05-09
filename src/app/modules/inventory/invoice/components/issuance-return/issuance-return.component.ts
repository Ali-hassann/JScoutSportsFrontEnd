import { Component, OnInit } from '@angular/core';
import { InventoryDocumentType } from 'src/app/shared/enums/invoices.enum';

@Component({
  selector: 'app-issuance-return',
  templateUrl: './issuance-return.component.html',
})
export class IssuanceReturnComponent  {

  InventoryDocumentType = InventoryDocumentType;

}
