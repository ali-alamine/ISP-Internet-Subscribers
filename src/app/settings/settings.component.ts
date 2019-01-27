import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from './settings.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  modalReference: any;
  uploadedFile: any[] = [];
  passSett;
  private userForm;
  userInfo;
  constructor(
    private modalService: NgbModal,
    private router: Router, 
    private settingsService: SettingsService , 
 ) { }

  ngOnInit() {
    // if (localStorage.getItem("user") !== '1') {
    //   this.router.navigate(["login"]);
    // }
  }
  openPassSettingModal(changePassModal){
    this.modalReference = this.modalService.open(changePassModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
     this.passSett = new FormGroup({
      oldPass: new FormControl(''),
      newPass: new FormControl(''),
    });
    
  }
  changePass(){
    this.settingsService.changePass(this.passSett.value).subscribe(Response => {
      swal("success")
      this.modalReference.close();
    }, error => {
      swal("Incorrect Password")
    });
  }

  // openRestoreModal(restoreModal) {
  //   this.modalReference = this.modalService.open(restoreModal, { centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  // }
  myUpload(event) {
    for (let file of event.files) {
      this.uploadedFile.push(file);

      this.settingsService.uploadScript(file).subscribe(Response => {
        // console.log(Response);
      }, error => {
        // console.log(error);
      });
    }
  }


  backup() {

    this.settingsService.backup();
  }

}
