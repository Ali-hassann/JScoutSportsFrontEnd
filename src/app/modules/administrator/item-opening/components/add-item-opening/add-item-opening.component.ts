// import { Component, OnInit } from '@angular/core';
// import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
// import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
// import { ItemRequest } from 'src/app/modules/inventory/pre-requisite/items/models/items.model';
// import { ItemsQuery } from 'src/app/modules/inventory/pre-requisite/items/states/items.query';
// import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
// import { ItemOpeningRequest } from '../../models/item-opening.model';
// import { NgForm } from '@angular/forms';
// import { ItemOpeningService } from '../../item-opening.service';
// import { MessageService } from 'primeng/api';
// import { InventoryRights } from 'src/app/shared/enums/rights.enum';

// @Component({
//   selector: 'app-add-item-opening',
//   templateUrl: './add-item-opening.component.html',
//   styleUrls: ['./add-item-opening.component.scss']
// })
// export class AddItemOpeningComponent implements OnInit {

//   itemOpening: ItemOpeningRequest = new ItemOpeningRequest();
//   itemList: ItemRequest[] = [];

//   InventoryRights = InventoryRights;

//   constructor(
//     private _authQuery: AuthQuery,
//     private _itemsQuery: ItemsQuery,
//     public _configDialogRef: DynamicDialogRef,
//     public _configDialog: DynamicDialogConfig,
//     private _itemOpeningService: ItemOpeningService,
//     private _messageService: MessageService,
//   ) {
//     if (this._configDialog?.data?.ItemOpeningId > 0) {
//       CommonHelperService.mapSourceObjToDestination(this._configDialog?.data, this.itemOpening);
//     }
//   }

//   ngOnInit(): void {
//     this.gettingDataFromStores();
//   }

//   gettingDataFromStores() {
//     this._itemsQuery.itemsList$.subscribe(res => {
//       res?.length > 0 ? this.itemList = res : [];
//     });
//   }

//   public Close(isToREfresh: boolean = false) {
//     this._configDialogRef.close(isToREfresh);
//   }

//   public submit(f: NgForm) {
//     if (!f.invalid) {
//       this.itemOpening.OutletId = this._authQuery?.PROFILE?.OutletId;
//       if (this.itemOpening?.ItemOpeningId > 0) {
//         this.UpdateItem(this.itemOpening);
//       }
//       else {
//         this.addItem(this.itemOpening);
//       }
//     }
//     else {
//       this._messageService.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
//     }
//   }

//   private addItem(request: ItemOpeningRequest) {
//     this._itemOpeningService.addItemOpening(request).subscribe(
//       (x: ItemOpeningRequest) => {
//         if (x?.ItemOpeningId > 0) {
//           this._messageService.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
//           this.Close(true);
//         }
//       }
//     )
//   }

//   private UpdateItem(request: ItemOpeningRequest) {
//     this._itemOpeningService.updateItemOpening(request).subscribe(
//       (x: ItemOpeningRequest) => {
//         if (x?.ItemOpeningId > 0) {
//           this._messageService.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
//           this.Close(true);
//         }
//       }
//     )
//   }
// }
