import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { VALIDATION_TYPE } from 'src/app/shared/enums/validation-type.enum';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
  :host ::ng-deep .pi-eye,
  :host ::ng-deep .pi-eye-slash {
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
  }
`]
})
export class LoginComponent {

  public loginForm: FormGroup = this.formBuilder.group({});
  public baseUrl = environment.baseUrlApp ?? "";

  constructor(
    public layoutService: LayoutService,
    private formBuilder: FormBuilder,
    private authServive: AuthService,
    private _dval: DomainValidatorsService) {
    this.buildForm();
  }

  public login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return;
    }
    else {
      this.authServive.login(this.loginForm.value);
    }
  }

  moveCursor(nextInput: HTMLInputElement) {
    nextInput.focus();
  }

  public buildForm(): void {
    this.loginForm = this.formBuilder.group({
      UserName: ['',
        [
          this._dval.getValidator(VALIDATION_TYPE.USERNAME),
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      Password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }
}
