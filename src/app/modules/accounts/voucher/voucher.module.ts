import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddVoucherComponent } from './component/add-voucher/add-voucher.component';
import { VoucherListComponent } from './component/voucher-list/voucher-list.component';
import { RouterModule, Routes } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonFormModules } from 'src/app/shared/modules/common-form-modules.modules';
import { PaymentVoucherComponent } from './component/voucher-detail/payment-voucher/payment-voucher.component';
import { JournalVoucherComponent } from './component/voucher-detail/journal-voucher/journal-voucher.component';
import { ReceiptVoucherComponent } from './component/voucher-detail/receipt-voucher/receipt-voucher.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenubarModule } from 'primeng/menubar';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ShowSpecificPropertyPipe } from 'src/app/shared/pipes/show-specific-property.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { CommonSharedModule } from 'src/app/shared/modules/common-shared.module';
import { GalleryModule } from '../../common/gallery/gallery.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BankJournalVoucherComponent } from './component/voucher-detail/bank-receipt-voucher/bank-receipt-voucher.component';
import { MessageService } from 'primeng/api';
import { VoucherService } from './services/voucher.service';
import { MultiCashPaymentVoucherComponent } from './component/voucher-detail/multi-cash-payment-voucher/multi-cash-payment-voucher.component';
import { JournalComponent } from './component/journal/journal.component';
import { PaymentComponent } from './component/payment/payment.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: "Voucher" },
    component: VoucherListComponent, pathMatch: 'full'
  },
]

@NgModule({
  declarations: [
    AddVoucherComponent
    , VoucherListComponent
    , PaymentVoucherComponent
    , JournalVoucherComponent
    , BankJournalVoucherComponent
    , ReceiptVoucherComponent
    , ShowSpecificPropertyPipe
    , MultiCashPaymentVoucherComponent
    , JournalVoucherComponent
    , JournalComponent
    , PaymentComponent
  ],
  imports: [
    CommonModule
    , TabViewModule
    , TieredMenuModule
    , RouterModule.forChild(routes)
    , TableModule
    , CalendarModule
    , CommonFormModules
    , ToggleButtonModule
    , RadioButtonModule
    , MenubarModule
    , CheckboxModule
    , PaginatorModule
    , CommonSharedModule
    , SplitButtonModule
    , GalleryModule
    , TabViewModule
  ],
  providers: [
    DialogService
    , FileViewerService
    , MessageService
    , VoucherService
  ],
})
export class VoucherModule { }
