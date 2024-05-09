import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authServive: AuthService,) {
    this.logout();
  }

  ngOnInit(): void {
    this.logout();
  }

  public logout(): void {
    this.authServive.loggedOut();
  }
}
