import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { PayrollDashboardService } from '../../services/payroll-dashboard.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { EmployeeDashboardResponse, FinancialSummaryResponse } from '../../models/payroll-dashboard.model';
import { AttendanceService } from '../../../attendance/services/attendance.service';
import { AttendanceResponse, EmployeeFilterRequest } from '../../../attendance/models/attendance.model';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';

@Component({
  selector: 'app-payroll-dashboard',
  templateUrl: './payroll-dashboard.component.html',
  styleUrls: ['./payroll-dashboard.component.scss']
})
export class PayrollDashboardComponent implements OnInit {

  public employeeSummaryList: EmployeeDashboardResponse[] = [];
  public allowanceSummaryList: FinancialSummaryResponse[] = [];
  selectedAttendance = "Absent";
  public loanSummaryList: FinancialSummaryResponse[] = [];
  loanChartData: any;
  loanChartOptions: any;

  allowanceChartData: any;
  allowanceChartOptions: any;

  employeeSalaryChartData: any;
  employeeSalaryChartOptions: any;

  employeeCountChartData: any;
  employeeCountChartOptions: any;

  private attendanceResponseList: AttendanceResponse[] = [];
  public attendanceAccordingToStatus: AttendanceResponse[] = [];

  public present: number = 0;
  public absent: number = 0;
  public leave: number = 0;

  constructor(
    private _breadcrumbService: AppBreadcrumbService,
    private _dashboardService: PayrollDashboardService,
    private _authQuery: AuthQuery,
    private _attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.getInitialData();
    this.getAttendanceList();
  }

  changeAttendanceStatus(status: number) {

    this.attendanceAccordingToStatus = [];
    if (status === 1) {
      this.attendanceAccordingToStatus = this.attendanceResponseList.filter((status: AttendanceResponse) => status.StatusName === 'PRESENT');
      this.selectedAttendance = "Present";
    } else if (status === 2) {
      this.selectedAttendance = "Absent";
      this.attendanceAccordingToStatus = this.attendanceResponseList.filter((status: AttendanceResponse) => status.StatusName === 'ABSENT' || status.StatusName === 'N/A');
    } else if (status === 3) {
      this.selectedAttendance = "Leave";
      this.attendanceAccordingToStatus = this.attendanceResponseList.filter((status: AttendanceResponse) => status.StatusName === 'LEAVEPAID' || status.StatusName === 'LEAVEUNPAID' || status.StatusName === 'HALFLEAVE');
    }
  }

  private getAttendanceList() {
    let attendanceRequest: EmployeeFilterRequest = new EmployeeFilterRequest();
    attendanceRequest.OutletId = this._authQuery.PROFILE.OutletId;
    attendanceRequest.OrganizationId = this._authQuery.PROFILE.OrganizationId;
    attendanceRequest.FromDate = DateHelperService.getServerDateFormat(new Date());
    this._attendanceService.getAttendanceList(attendanceRequest).subscribe(
      (data: AttendanceResponse[]) => {
        this.attendanceResponseList = data;
        this.leave = data.filter((status: AttendanceResponse) => status.StatusName == 'LEAVEPAID' || status.StatusName === 'LEAVEUNPAID' || status.StatusName === 'HALFLEAVE').length;
        this.present = data.filter((status: AttendanceResponse) => status.StatusName == 'PRESENT').length;
        this.absent = data.filter((status: AttendanceResponse) => status.StatusName == 'ABSENT' || status.StatusName === "N/A").length;
        this.attendanceAccordingToStatus = data.filter((status: AttendanceResponse) => status.StatusName === 'ABSENT' || status.StatusName === 'N/A');
      }
    )
  }

  private setBreadCrumb(): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Payroll Dashboard', routerLink: ['payroll-dashboard'] },
    ]);
  }

  getInitialData() {
    this._dashboardService.getEmployeeDashboardData(this._authQuery.OutletId).subscribe(res => {

      this.employeeSummaryList = res;
      //barchart
      this.prepareEmployeeSalaryChart();
      //in employee salary sum create chart of salary department wise
      this.prepareEmployeeCountChart();
    });

    this._dashboardService.getAllowanceDashboardData(this._authQuery.OutletId).subscribe(res => {

      this.allowanceSummaryList = res;
      this.prepareEmployeeAllowanceChart();
      //piechart
    });

    this._dashboardService.getLoanDashboardData(this._authQuery.OutletId).subscribe(res => {

      this.loanSummaryList = res;
      this.prepareEmployeeLoanChart();
      //barchart
    });
  }

  clr: any[] = []

  generateUniqueColor(): any {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    const color = `rgba(${red},${green},${blue})`;

    if (this.clr.includes(color)) {
      return this.generateUniqueColor(); // Recursively call the function if color is already present
    }

    return color;
  }

  prepareEmployeeLoanChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    let labels: any[] = [];
    let data: any[] = [];

    this.loanSummaryList.forEach((b, index) => {
      labels.push(b.DepartmentsName);
      data.push(b.Amount);
      const color = this.generateUniqueColor();
      this.clr.push(color);

    });
    this.loanChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Employee Loan',
          data: data,
          backgroundColor: this.clr,
          borderColor: this.clr,
          //  backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(249, 181, 208, 0.2)', 'rgba(22, 255, 0, 0.2)', 'rgba(63, 0, 255, 0.2)', 'rgba(0, 255, 191, 0.2)', 'rgba(255, 153, 0, 0.2)', 'rgba(233, 255, 0.2)', 'rgba(210,105,30, 0.2)', 'rgba(199,21,133, 0.2)', 'rgba(147,112,219, 0.2)', , 'rgba(0,255,127,0.2)'],
          // borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(249, 181, 208)', 'rgb(22, 255, 0)', 'rgb(63, 0, 255)', 'rgb(0, 255, 191)', 'rgb(255, 153, 0)', 'rgb(233, 255, 0)', 'rgb(210,105,30)', 'rgb(199,21,133)', 'rgb(147,112,219)', 'rgb(0,255,127)'],
          borderWidth: 1.5
        },
      ]
    };

    this.loanChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  prepareEmployeeAllowanceChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    let labels: any[] = [];
    let data: any[] = [];
    this.allowanceSummaryList.forEach(b => {
      labels.push(b.TypeName);
      data.push(b.Amount);
      const color = this.generateUniqueColor();
      this.clr.push(color);
    });

    this.allowanceChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Allowance',
          data: data,
          backgroundColor: this.clr,
          borderColor: this.clr,
          // backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--blue-300'), documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--red-400')],
          // hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--blue-200'), documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--red-300')],
          borderWidth: 1.5
        },
      ]
    };

    this.allowanceChartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    }
  }

  prepareEmployeeSalaryChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    let labels: any[] = [];
    let data: any[] = [];

    this.employeeSummaryList.forEach(b => {
      labels.push(b.DepartmentsName);
      data.push(b.SalarySum);
      const color = this.generateUniqueColor();
      this.clr.push(color);
    });

    this.employeeSalaryChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Employee Salary',
          data: data,
          backgroundColor: this.clr,
          borderColor: this.clr,
          // backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(249, 181, 208, 0.2)', 'rgba(22, 255, 0, 0.2)', 'rgba(63, 0, 255, 0.2)', 'rgba(0, 255, 191, 0.2)', 'rgba(255, 153, 0, 0.2)', 'rgba(233, 255, 0.2)', 'rgba(210,105,30, 0.2)', 'rgba(199,21,133, 0.2)', 'rgba(147,112,219, 0.2)', , 'rgba(0,255,127,0.2)'],
          // borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(249, 181, 208)', 'rgb(22, 255, 0)', 'rgb(63, 0, 255)', 'rgb(0, 255, 191)', 'rgb(255, 153, 0)', 'rgb(233, 255, 0)', 'rgb(210,105,30)', 'rgb(199,21,133)', 'rgb(147,112,219)', 'rgb(0,255,127)'],
          borderWidth: 1.5
        },
      ]
    };

    this.employeeSalaryChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  prepareEmployeeCountChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    let labels: any[] = [];
    let data: any[] = [];

    this.employeeSummaryList.forEach(b => {
      labels.push(b.DepartmentsName);
      data.push(b.EmployeeCount);
      const color = this.generateUniqueColor();
      this.clr.push(color);
    });

    this.employeeCountChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Total Employee',
          data: data,
          backgroundColor: this.clr,
          borderColor: this.clr,
          // backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--blue-300'), documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--red-400')],
          // hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--blue-200'), documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--red-300')],
          borderWidth: 1.5
        },
      ]
    };

    this.employeeCountChartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    }
  }
}
