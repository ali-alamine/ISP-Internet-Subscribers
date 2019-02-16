import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { DrawerService } from './drawer/drawer.service';
import { Router, NavigationEnd} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'E-Safe Subscribers';
  modalReference: any;
  objDate;
  drawerForm;
  currentUrl: string;
  constructor(private router: Router,private modalService: NgbModal, private fb: FormBuilder,private drawerService:DrawerService) { }

  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { 
        this.currentUrl = event.url;
        var date = formatDate(new Date(), 'yyyy/MM/dd', 'en');
        if (localStorage.getItem("date") !== date) {
          this.drawerForm = this.fb.group({
            internetAmount: ['', Validators.required],
            // mobileDrawer: ['', Validators.required],
            accessories: ['', Validators.required],
            // omt: ['', Validators.required]
          });
          let element: HTMLElement = document.getElementById('editSupplierBtn') as HTMLElement;
          element.click();   
        }
      }
    });
  }


  openSupplierModal(supplierModal) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    this.modalReference = this.modalService.open(supplierModal, ngbModalOptions);

  }

  setDrawer() {
    this.drawerService.setDrawer(this.drawerForm.value).subscribe(response=>{
      console.log(Response);
    })
    
    var date = formatDate(new Date(), 'yyyy/MM/dd', 'en')    
    localStorage.setItem("date", date);
    this.modalReference.close();
  }
  

}
