import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit {
  currentUrl: string;
  modalReference: any;
  subscriberModalTitle;

  constructor(
    private router: Router,
    private modalService: NgbModal, 
    private fb: FormBuilder) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
   }

  ngOnInit() {
    this.router.navigate(["drawer/internet"]);
  }
}