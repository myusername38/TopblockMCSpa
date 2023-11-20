import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit, OnDestroy {

  constructor(private router: Router) {}

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
  }

  ngOnDestroy(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('landing-page');
  }

  manageStaff() {
    this.router.navigate(['admin/staff']);  
  }

  managePlayers() {
    this.router.navigate(['admin/players'])
  }

  manageServer() {
    this.router.navigate(['admin/server'])
  }
}
