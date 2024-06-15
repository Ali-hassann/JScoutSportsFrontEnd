import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { UserRightsQuery } from '../modules/setting/rights/states/user-rights.query';
import { MainMenuRights } from '../shared/enums/rights.enum';
import { LayoutService } from './service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { CommonHelperService } from '../shared/services/common-helper.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfigurationSettingComponent } from '../modules/accounts/accounts-configuration/component/accounts-configuration/configuration-setting.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    providers: [DialogService]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    password: string = "";
    displayPasswordDialog: boolean = false;
    accountsSubMenues: MenuItem[] = [];
    employeeSubMenues: any[] = [];
    stockManagmentSubMenues: any[] = [];
    inventorySubMenues: any[] = [];
    adminSubMenues: any[] = [];
    productionSubMenues: any[] = [];
    exportSubMenues: any[] = [];
    productionProcessSubMenues: any[] = [];
    MainMenuRights = MainMenuRights
    constructor(
        public layoutService: LayoutService,
        public _userRightQuery: UserRightsQuery,
        public _commonHelperService: CommonHelperService,
        public _dialogService: DialogService,
        private _router: Router,
    ) { }
    checkValidaton() {
        // this.displayModal = true;
        if (this.password == "Tippo@1234") {
            this.openConfigurationDialog();
            this.displayPasswordDialog = false;
        }
    }



    public openConfigurationDialog(): void {
        // Loading Dynamically Module
        this._commonHelperService.loadModule(() =>
            import(
                "src/app/modules/accounts/accounts-configuration/configuration-setting.module"
            ).then((x) => x.AccountsConfigurationModule)
        );
        //

        let dialogRef = this._dialogService.open(
            ConfigurationSettingComponent,
            {
                header: "Account Configuration",
                width: "50%",
                height: "70%",
                maximizable: true
            }
        );
    }
    ngOnInit() {
        // Administrator menues

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewAdministrator)) {
            this.model.push({
                icon: "pi pi-user",
                items: [
                    {
                        label: "Administrator",
                        icon: "pi pi-user",
                        items: this.adminSubMenues
                    }]
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewProdPreRequisite)) {
            this.productionSubMenues.push({
                label: "Pre Requists",
                icon: "pi pi-slack",
                routerLink: ["production-pre-requisite"],
            });
        }


        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewProdOrder)) {
            this.productionSubMenues.push({
                label: "Order",
                icon: "pi pi-slack",
                routerLink: ["production-order"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewPreRequisite)) {
            this.inventorySubMenues.push({
                label: "Pre Requists",
                icon: "pi pi-slack",
                routerLink: ["inventory-prerequists"],
            });
        }

        // if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewVendors)) {
        //     this.adminSubMenues.push({
        //         label: "Item Vendors",
        //         icon: "pi pi-slack",
        //         routerLink: ["inventory-prerequists/item-vendors"],
        //     });
        // }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewItemOpening)) {
            this.inventorySubMenues.push({
                label: "Items Opening",
                icon: "pi pi-slack",
                routerLink: ["item-opening"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewInventoryReports)) {
            this.inventorySubMenues.push({
                label: "Reports",
                icon: "pi pi-slack",
                routerLink: ["inventory-reports"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewVendors)) {
            this.adminSubMenues.push({
                label: "Vendors",
                icon: "pi pi-users",
                routerLink: ["inventory/vendors"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewCustomers)) {
            this.exportSubMenues.push({
                label: "Customers",
                icon: "pi pi-users",
                routerLink: ["inventory/customers"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewOthers)) {
            this.adminSubMenues.push({
                label: "Others",
                icon: "pi pi-users",
                routerLink: ["inventory/others"],

            });
        }

        // if (this._userRightQuery.getHasRight(this.MainMenuRights.CanAccessDashboard)) {
        this.accountsSubMenues.push({
            label: 'Dashboard',
            icon: 'pi pi-microsoft',
            routerLink: ['dashboard']
        });
        // }

        // Employee Sub Menus

        this.employeeSubMenues.push({
            label: "Dashboard",
            icon: "pi pi-microsoft",
            routerLink: ["payroll-dashboard"],
        });

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewEmployee)) {
            this.employeeSubMenues.push({
                label: "Employee",
                icon: "pi pi-users",
                routerLink: ["employee/employees"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewEmployee)) {
            this.employeeSubMenues.push({
                label: "Contractors",
                icon: "pi pi-users",
                routerLink: ["employee/contractors"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanManageAttendance)) {
            this.employeeSubMenues.push({
                label: "Attendance",
                icon: "pi pi-calendar-times",
                routerLink: ["attendance"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewOvertime)) {
            this.employeeSubMenues.push({
                label: "Overtime",
                icon: "pi pi-calendar-times",
                routerLink: ["overtime-attendance"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewSalarySheet)) {
            this.employeeSubMenues.push({
                label: "Salary Sheet",
                icon: "pi pi-chart-bar",
                routerLink: ["salary-sheet"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanManagePayroll)) {
            this.employeeSubMenues.push({
                label: "PreSettings",
                icon: "pi pi-spin pi-cog",
                routerLink: ["payroll-settings"],
            });
        }
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewPayrollReport)) {
            this.employeeSubMenues.push({
                label: "Reports",
                icon: "pi pi-print",
                routerLink: ["payroll-reports"],
            });
        }
        //

        // Accounts Sub Menues Options
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewCOA)) {
            {
                this.accountsSubMenues.push({
                    label: "Charts of Account",
                    icon: "pi pi-chart-bar",
                    routerLink: ["charts-of-account"],
                });
            }
        }
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewVoucher)) {
            {
                this.accountsSubMenues.push({
                    label: "Voucher",
                    icon: "pi pi-book",
                    routerLink: ["voucher"],
                });
            }
        }

        this.accountsSubMenues.push({
            label: "Loan/Advance Request",
            icon: "pi pi-book",
            routerLink: ["approval-loan"],
        });

        this.accountsSubMenues.push({
            label: "Weekly Wages",
            icon: "pi pi-book",
            routerLink: ["wages-approval"],
        });

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewAccountReports)) {
            {
                this.accountsSubMenues.push({
                    label: "Reports",
                    icon: "pi pi-print",
                    routerLink: ["reports"],
                });
            }
        }

        this.accountsSubMenues.push({
            label: "Account Setups",
            icon: "pi pi-spin pi-cog",
            command: () => {
                this.displayPasswordDialog = true;
            }
        });

        this.productionProcessSubMenues.push({
            label: "Sublimation",
            icon: "pi pi-slack",
            routerLink: ["production-process/sublimation"],
        });

        this.productionProcessSubMenues.push({
            label: "Press Cutting",
            icon: "pi pi-slack",
            routerLink: ["production-process/press-cutting"],
        });

        this.productionProcessSubMenues.push({
            label: "Laser Cutting",
            icon: "pi pi-slack",
            routerLink: ["production-process/laser-cutting"],
        });

        this.productionProcessSubMenues.push({
            label: "Pu/Pvc Printing",
            icon: "pi pi-slack",
            routerLink: ["production-process/pu-pvc-printing"],
        });

        this.productionProcessSubMenues.push({
            label: "Silicon Printing",
            icon: "pi pi-slack",
            routerLink: ["production-process/silicon-printing"],
        });

        this.productionProcessSubMenues.push({
            label: "Rubber Injection",
            icon: "pi pi-slack",
            routerLink: ["production-process/rubber-injection"],
        });

        this.productionProcessSubMenues.push({
            label: "Embossing Process",
            icon: "pi pi-slack",
            routerLink: ["production-process/embossing"],
        });

        this.productionProcessSubMenues.push({
            label: "Stitching",
            icon: "pi pi-slack",
            routerLink: ["production-process/stitching"],
        });

        // this.productionProcessSubMenues.push({
        //     label: "Looper",
        //     icon: "pi pi-slack",
        //     routerLink: ["production-process/looper"],
        // });

        this.productionProcessSubMenues.push({
            label: "Packing",
            icon: "pi pi-slack",
            routerLink: ["production-process/packing"],
        });

        this.productionProcessSubMenues.push({
            label: "Contract",
            icon: "pi pi-slack",
            routerLink: ["production-process/contract"],
        });

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewAccounts)) {
            this.model.push({
                icon: "pi pi-chart-pie",
                items: [
                    {
                        label: "Accounts",
                        icon: "pi pi-chart-pie",
                        items: this.accountsSubMenues
                    }]
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewPayroll)) {
            this.model.push({
                // label: "Payroll",
                icon: "pi pi-user",
                items: [
                    {
                        label: "Payroll",
                        icon: "pi pi-user",
                        items: this.employeeSubMenues
                    }]
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewInventory)) {
            // inventory menues
            this.model.push({
                icon: "pi pi-box",
                items: [
                    {
                        label: "Inventory",
                        icon: "pi pi-box",
                        items: this.inventorySubMenues
                    }]
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewStockManagement)) {
            // Stock Management menus
            this.model.push({
                icon: "pi pi-box",
                items: [
                    {
                        label: "Stock Management",
                        icon: "pi pi-box",
                        items: this.stockManagmentSubMenues
                    }]
            });
        }

        this.productionSubMenues.push({
            label: "Production Process",
            icon: "pi pi-slack",
            items: this.productionProcessSubMenues
        });

        this.productionSubMenues.push({
            label: "Weekly Wages",
            icon: "pi pi-chart-bar",
            routerLink: ["wages"],
        });

        this.productionSubMenues.push({
            label: "Reports",
            icon: "pi pi-print",
            routerLink: ["production-reports"],
        });
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewProduction)) {
            this.model.push({
                items: [
                    {
                        label: "Production",
                        icon: "pi pi-slack",
                        items: this.productionSubMenues
                    }]
            });
        }

        this.model.push({
            items: [
                {
                    label: "Export",
                    icon: "pi pi-slack",
                    items: this.exportSubMenues
                }]
        });

        this.exportSubMenues.push({
            label: "Order",
            icon: "pi pi-copy",
            routerLink: ["production-order"],
        });
        // if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewPurchase)) {
        this.stockManagmentSubMenues.push({
            label: "Purchase Requisition",
            icon: "pi pi-copy",
            routerLink: ["stock-management/purchase-requisition"],
        });
        // }
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewPurchaseOrder)) {
            this.stockManagmentSubMenues.push({
                label: "Purchase Order",
                icon: "pi pi-copy",
                routerLink: ["stock-management/purchase-order"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewPurchaseInvoice)) {
            this.stockManagmentSubMenues.push({
                label: "Purchase Invoice",
                icon: "pi pi-copy",
                routerLink: ["stock-management/purchase"],
            });
        }
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewPurchaseReturn)) {
            this.stockManagmentSubMenues.push({
                label: "Purchase Return",
                icon: "pi pi-copy",
                routerLink: ["stock-management/purchase-return"],
            });
        }
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewIssuance)) {
            this.stockManagmentSubMenues.push({
                label: "Issuance Invoice",
                icon: "pi pi-copy",
                routerLink: ["stock-management/issuance"],
            });
        }
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewIssuance)) {
            this.stockManagmentSubMenues.push({
                label: "Production Issuance",
                icon: "pi pi-copy",
                routerLink: ["stock-management/production-issuance"],
            });
        }
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewIssuanceReturn)) {
            this.stockManagmentSubMenues.push({
                label: "Issuance Return",
                icon: "pi pi-copy",
                routerLink: ["stock-management/issuance-return"],
            });
        }
        this.stockManagmentSubMenues.push({
            label: "Adjustment",
            icon: "pi pi-copy",
            routerLink: ["stock-management/adjustment"],
        });
        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewStockManagementReports)) {
            this.stockManagmentSubMenues.push({
                label: "Reports",
                icon: "pi pi-print",
                routerLink: ["stock-management/stock-management-reports"],
            });
        }

        if (this._userRightQuery.getHasRight(this.MainMenuRights.CanViewUsers)) {
            this.model.push({
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-spin pi-cog',
                        routerLink: ["setting"]
                    }
                ]
            });
        }

        this.model.push({
            items: [
                {
                    label: 'Logout',
                    icon: 'pi pi-fw pi-power-off',
                    routerLink: ["logout"]
                }
            ]
        });
    }
}
