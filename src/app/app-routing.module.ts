import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuardService } from './shared/guards/auth-guard.service';
import { FinancialReportResolverResolver as FinancialReportResolver } from './modules/accounts/reports/financial-reports/financial-report-resolver.resolver';
import { UserResolver } from './modules/setting/users/components/resolver/user-resolver.resolver';
import { AllowanceTypeResolver } from './modules/setting/benefit-types/resolver/allowance-type.resolver';
import { DesignationTypeResolver } from './modules/setting/designation-type/resolver/designation-type.resolver';
import { DepartmentResolver } from './modules/setting/department/resolver/department.resolver';
import { EmployeeResolver } from './modules/payroll/employee/resolver/employee.resolver';
import { VoucherResolver } from './modules/accounts/voucher/voucher.resolver';
import { PreRequisteResolver } from './modules/inventory/pre-requisite/resolver/pre-requiste.resolver';
import { ParticularResolver } from './modules/inventory/item-particular/resolver/particular.resolver';
import { InvoiceResolver } from './modules/inventory/invoice/resolver/invoice.resolver';
import { ProductionPreRequisteResolver } from './modules/production/pre-requisite/resolver/pre-requiste.resolver';
import { SalarySheetResolver } from './modules/payroll/salary-sheet/salary-sheet.resolver';


const routes: Routes = [
    {
        path: "",
        loadChildren: () =>
            import("./modules/common/auth/auth.module").then((m) => m.AuthModule),
    },
    {
        path: "shortwait",
        loadChildren: () =>
            import("../app/shared/short-wait/short-wait.module").then((m) => m.ShortWaitModule),
    },
    // {
    //     path: "referesh",
    //     component: AppRefereshComponent,
    // },
    {
        path: 'app', component: AppLayoutComponent,
        children: [
            // {
            //     path: "setting",
            //     loadChildren: () =>
            //         import(
            //             "./modules/setting/setting.module"
            //         ).then((m) => m.SettingModule),
            //     canActivate: [AuthGuardService],
            // },

            {
                path: "setting",
                loadChildren: () =>
                    import("./modules/setting/setting.module").then(
                        (m) => m.SettingModule
                    ),
                canActivate: [AuthGuardService],
            },
            {
                path: "setting/users",
                loadChildren: () =>
                    import("./modules/setting/users/users.module").then(
                        (m) => m.UsersModule
                    ),
                resolve: [UserResolver]
            },
            {
                path: "setting/roles",
                loadChildren: () =>
                    import("./modules/setting/organization-role/organization-role.module").then(
                        (m) => m.OrganizationRoleModule
                    ),
            },
            {
                path: "charts-of-account",
                loadChildren: () =>
                    import(
                        "./modules/accounts/charts-of-accounts/charts-of-account.module"
                    ).then((m) => m.ChartsOfAccountModule),
                canActivate: [AuthGuardService],
            },
            {
                path: "voucher",
                loadChildren: () =>
                    import("./modules/accounts/voucher/voucher.module").then(
                        (m) => m.VoucherModule
                    ),
                canActivate: [AuthGuardService],
                resolve: [VoucherResolver]
            },
            {
                path: "approval-loan",
                loadChildren: () =>
                    import("./modules/accounts/loan-approval/loan-approval.module").then(
                        (m) => m.LoanApprovalModule
                    ),
                canActivate: [AuthGuardService]
            },
            {
                path: "wages-approval",
                loadChildren: () =>
                    import("./modules/accounts/wages-approval/wages-approval.module").then(
                        (m) => m.WagesApprovalModule
                    ),
                canActivate: [AuthGuardService]
            },
            {
                path: "reports",
                loadChildren: () =>
                    import(
                        "./modules/accounts/reports/reports/reports.module"
                    ).then((m) => m.ReportsModule),
                // component: ReportsComponent,
                canActivate: [AuthGuardService],

            },
            {
                path: "reports/financialreports",
                loadChildren: () =>
                    import(
                        "./modules/accounts/reports/financial-reports/financial-reports.module"
                    ).then((m) => m.FinancialReportsModule),
                canActivate: [AuthGuardService],
                resolve: [FinancialReportResolver]
            },
            {
                path: "reports/transaction",
                loadChildren: () =>
                    import(
                        "./modules/accounts/reports/transaction-reports/transaction-report.module"
                    ).then((m) => m.TransactionReportModule),
                canActivate: [AuthGuardService],
            },
            {
                path: "rights",
                loadChildren: () =>
                    import("./modules/setting/rights/rights.module").then(
                        m => m.RightsModule
                    ),
                canActivate: [AuthGuardService],
            },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./modules/dashboard/dashboard.module').then(
                        m => m.DashboardModule),
                canActivate: [AuthGuardService],
                resolve: [VoucherResolver]
            },
            {
                path: 'wellcome',
                loadChildren: () =>
                    import('./modules/wellcome/wellcome.module').then(
                        m => m.WellcomeModule),
                canActivate: [AuthGuardService],
            },
            {
                path: 'payroll-dashboard',
                loadChildren: () =>
                    import('./modules/payroll/payroll-dashboard/payroll-dashboard.module').then(
                        m => m.PayrollDashboardModule),
                canActivate: [AuthGuardService],
            },
            {
                path: 'employee',
                loadChildren: () =>
                    import('./modules/payroll/employee/employee.module').then(
                        m => m.EmployeeModule),
                canActivate: [AuthGuardService],
                resolve: [DepartmentResolver, AllowanceTypeResolver, DesignationTypeResolver, EmployeeResolver]
            },
            {
                path: 'payroll-settings',
                loadChildren: () =>
                    import('./modules/payroll/payroll-settings/payroll-settings.module').then(
                        m => m.PayrollSettingsModule),
                canActivate: [AuthGuardService],
            },
            {
                path: 'payroll-reports',
                loadChildren: () =>
                    import('./modules/payroll/reports/payroll-employee-reports.module').then(
                        m => m.PayrollEmployeeReportsModule),
                resolve: [DepartmentResolver, EmployeeResolver],
                canActivate: [AuthGuardService],
            },
            {
                path: "payroll-settings/department",
                loadChildren: () =>
                    import("./modules/setting/department/department.module").then(
                        (m) => m.DepartmentModule
                    ),
                resolve: [DepartmentResolver],
            },
            {
                path: "payroll-settings/allowance-type",
                loadChildren: () =>
                    import("./modules/setting/benefit-types/allowance-types.module").then(
                        (m) => m.AllowanceTypesModule
                    ),
                resolve: [AllowanceTypeResolver],
            },
            {
                path: "payroll-settings/gazetted-holiday",
                loadChildren: () =>
                    import("./modules/setting/department copy/gazetted-holiday.module").then(
                        (m) => m.GazettedHolidayModule
                    )
            },
            {
                path: "payroll-settings/annual-leaves",
                loadChildren: () =>
                    import("./modules/setting/department copy 2/annual-leave.module").then(
                        (m) => m.AnnualLeaveModule
                    )
            },
            {
                path: "payroll-settings/designation",
                loadChildren: () =>
                    import("./modules/setting/designation-type/designation-type.module").then(
                        (m) => m.DesignationTypeModule
                    ),
                resolve: [DesignationTypeResolver],
            },
            {
                path: 'attendance',
                loadChildren: () =>
                    import('./modules/payroll/attendance/attendance.module').then(
                        m => m.AttendanceModule),
                canActivate: [AuthGuardService],
            },
            {
                path: 'overtime-attendance',
                loadChildren: () =>
                    import('./modules/payroll/overtime-attendance/overtime-attendance.module').then(
                        m => m.OvertimeAttendanceModule),
                canActivate: [AuthGuardService],
            },
            {
                path: 'salary-sheet',
                loadChildren: () =>
                    import('./modules/payroll/salary-sheet/salary-sheet.module').then(
                        m => m.SalarySheetModule),
                canActivate: [AuthGuardService],
                resolve: [SalarySheetResolver]
            },
            {
                path: 'wages',
                loadChildren: () =>
                    import('./modules/payroll/salary-sheet copy/wages.module').then(
                        m => m.WagesModule),
                canActivate: [AuthGuardService],
            },

            // production

            {
                path: 'production-pre-requisite',
                loadChildren: () =>
                    import('./modules/production/pre-requisite/pre-requisite.module').then(
                        m => m.PreRequisiteModule),
                resolve: [ProductionPreRequisteResolver]
            },
            {
                path: 'production-order',
                loadChildren: () =>
                    import('./modules/production/order/order.module').then(
                        m => m.OrderModule),
                resolve: [ProductionPreRequisteResolver]
            },
            {
                path: 'production-process',
                loadChildren: () =>
                    import('./modules/production/production-process/production-process.module').then(
                        m => m.ProductionProcessModule),
                resolve: [ProductionPreRequisteResolver]
            },
            {
                path: 'production-reports',
                loadChildren: () =>
                    import('./modules/production/reports/production-reports.module').then(
                        m => m.ProductionReportsModule),
                resolve: [ProductionPreRequisteResolver]
            },
            //

            // invertory routing
            {
                path: 'inventory-prerequists',
                loadChildren: () =>
                    import('./modules/inventory/pre-requisite/pre-requisite.module').then(
                        m => m.PreRequisiteModule),
                resolve: [PreRequisteResolver]
            },

            {
                path: 'item-opening',
                loadChildren: () =>
                    import('./modules/administrator/item-opening/item-opening.module').then(
                        m => m.ItemOpeningModule),
                resolve: [PreRequisteResolver]
            },
            {
                path: 'inventory',
                loadChildren: () =>
                    import('./modules/inventory/item-particular/item-particular.module').then(
                        m => m.ItemVendorModule),
                resolve: [ParticularResolver]
            },
            {
                path: 'inventory-reports',
                loadChildren: () =>
                    import('./modules/inventory/reports/inventory-reports.module').then(
                        m => m.InventoryReportsModule)
            },
            {
                path: 'stock-management/stock-management-reports',
                loadChildren: () =>
                    import('./modules/stock-management/reports/stock-management-reports.module').then(
                        m => m.StockManagementReportsModule),
                resolve: [PreRequisteResolver]
            },
            {
                path: 'stock-management/production-issuance',
                loadChildren: () =>
                    import('./modules/inventory/invoice/production-invoice.module').then(
                        m => m.ProductionInvoiceModule),
                resolve: [PreRequisteResolver]
            },
            {
                path: 'stock-management',
                loadChildren: () =>
                    import('./modules/inventory/invoice/invoice.module').then(
                        m => m.InvoiceModule),
                resolve: [PreRequisteResolver, ParticularResolver, InvoiceResolver]
            },
            {
                path: 'stock-management/purchase-order',
                loadChildren: () =>
                    import('./modules/stock-management/purchase-order/purchase-order.module').then(
                        m => m.PurchaseOrderModule),
                resolve: [PreRequisteResolver, ParticularResolver]
            },
            {
                path: 'logout',
                loadChildren: () =>
                    import('./modules/common/auth/components/logout/logout/logout.module').then(
                        m => m.LogoutModule)
            },
        ]
    },
]
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" }),
    ],
    exports: [RouterModule],
    providers: [AuthGuardService],
})
export class AppRoutingModule {
}
