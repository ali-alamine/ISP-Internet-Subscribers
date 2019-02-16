import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
declare var $: any;
import { MenuItem } from 'primeng/api';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SubscribersService } from './subscribers.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {
  items: MenuItem[];
  dialogContextMenu: MenuItem[];
  private globalSubscriberDataTable;
  private static selectedRowData;
  private static selectedSubscriberID;
  private subscriberModalTitle;
  private subscriberForm;
  private resubscribeForm;
  private debitPaymentForm;
  modalReference: any;
  editedSubscriberData = {};
  editFlag = false;
  subscriberName;
  minExpDate;
  private subscriberMonths;
  navigateToSubsFlag=0;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private subscriberService: SubscribersService, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    var subscriberDataTable = $('#subscribersDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: true,
      fixedHeader: true,
      select: {
        "style": "single"
      },
      searching: true,
      lengthMenu: [[25, 50, 100, 200, 400, 800], [25, 50, 100, 200, 400, 800]],
      ajax: {
        type: "get",
        url: "http://localhost/e-safe-data/src/assets/api/dataTables/subscriberDataTable.php",
        data: {},
        cache: true,
        async: false
      },
      order: [[0, 'asc']],
      columns: [
        { data: "ID", title: "ID" },
        { data: "name", title: "Name" },
        { data: "username", title: "username" },
        { data: "profile", title: "Profile", render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') },
        { data: "phone", title: "Phone" },
        { data: "address", title: "Address" },
        { data: "subDate", title: "Sub Date" },
        { data: "expDate", title: "Exp Date" },
        { data: "isPaid", title: "Paid/Unpaid" },
        { data: "is_activated", title: "Activated" },
        { data: "amountDue", title: "amountDue" , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }
      ],
      "columnDefs": [
        {
          "targets": 8,
          "data": "isPaid",
          "render": function (data, type, row, meta) {
            if (data == 1) {
              return '<span style="color:blue">Paid</span>';
            }
            else if (data == 0) {
              return '<span  style="color:red">Unpaid</span>';
            }
            else {
              return '';
            }
          }
        },
        {
          "targets": 9,
          "data": "is_activated",
          "render": function (data, type, row, meta) {
            if (data == 0) {
              return '<span  style="color:red">Deactivated</span>';
            }
            else {
              return '<span  style="color:blue">Activated</span>';
            }
          }
        }
      ]
    });
    

    $('#subscribersDT tbody').on('click', 'a.deactivate', function () {
      var data = subscriberDataTable.row($(this).parents('tr')).data();
      var data12 = { "id": data['ID'] };


    });
    $('#subscribersDT tbody').on('click', 'a.payment', function () {
      var data = subscriberDataTable.row($(this).parents('tr')).data();
      alert(data['ID'] + "   payment");
    });

    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editSubscriberBtn') as HTMLElement;
          element.click();
        }
      },
      {
        label: 'Copy',
        icon: 'pi pi-fw pi-copy',
        command: (event) => {
          let element: HTMLElement = document.getElementById('copyNameBtn') as HTMLElement;
          element.click();
        }
      }, 
      {
        label: 'Debit Payment',
        icon: 'pi pi-fw pi-plus',
        command: (event) => {
          let element: HTMLElement = document.getElementById('debitPaymentBtn') as HTMLElement;
          element.click();
        }
      }, 
      {
        label: 'Toggle Activation',
        icon: 'pi pi-fw pi-ban',
        command: (event) => {
          let element: HTMLElement = document.getElementById('toggleActivationBtn') as HTMLElement;
          element.click();
        }

      }, {
        label: 'Toggle Payment',
        icon: 'pi pi-fw pi-ban',
        command: (event) => {
          let element: HTMLElement = document.getElementById('togglePaymentBtn') as HTMLElement;
          element.click();
        }

      },
      {
        label: 'Resubscribe',
        icon: 'pi pi-fw pi-cloud',
        command: (event) => {
          let element: HTMLElement = document.getElementById('resubscribeBtn') as HTMLElement;
          element.click();
        }

      },
      {
        label: 'Show payments',
        icon: 'pi pi-fw pi-arrow-right',
        command: (event) => {
          let element: HTMLElement = document.getElementById('showPayments') as HTMLElement;
          element.click();
        }

      }
    ];

    var selectedRowLS = localStorage.getItem('selectedRow');
    var x = localStorage.getItem('XOffset');
    var y = localStorage.getItem('YOffset');

    if (x !== null && y !== null){
      window.scroll(+x,+y);
      localStorage.removeItem('XOffset');
      localStorage.removeItem('YOffset');
    }
     
    if (selectedRowLS !== null){
      subscriberDataTable.row(selectedRowLS).select();
      localStorage.removeItem('selectedRow');
    }

    this.globalSubscriberDataTable = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        SubscribersComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        var data = subscriberDataTable.row(indexes).data()['ID'];
        SubscribersComponent.selectedSubscriberID = data;
        localStorage.setItem('selectedRow', indexes);
      }
      else if (type === 'column') {
        SubscribersComponent.selectedSubscriberID = -1;
      }
    });

    $('#subscribersDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $('#subscribersDT').on('key-focus.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#subscribersDT').on('key-blur.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
    });
  }

  openResubscribeModal(resubscribeModal) {
    if (SubscribersComponent.selectedRowData['is_activated'] == 0) {
      Swal({
        type: 'info',
        title: "This user is deactivated",
        text: 'Activate this user to autosubscribe his service'
      });

    }
    this.modalReference = this.modalService.open(resubscribeModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var subDate = '';
    var expDate = '';
    var isPaid = 0;
    var subID = SubscribersComponent.selectedSubscriberID;
    var profile = SubscribersComponent.selectedRowData['profile'];

    this.subscriberName = SubscribersComponent.selectedRowData['name'];

    this.minExpDate = new Date(SubscribersComponent.selectedRowData['expDate']);
    this.resubscribeForm = this.fb.group({
      subDate: [subDate, Validators.required],
      expDate: { disabled: true },
      isPaid: [isPaid],
      profile: [profile],
      subID: [subID]
    });

    this.onChanges();
  }
  onChanges(): void {
    this.resubscribeForm.get('subDate').valueChanges.subscribe(val => {
      var expDate = new Date(this.resubscribeForm.get('subDate').value);

      expDate = new Date(expDate.setMonth(expDate.getMonth() + 1));
      this.resubscribeForm.get('expDate').setValue(expDate)
    });
  }
  openSubscriberModal(subscriberModal) {
    this.modalReference = this.modalService.open(subscriberModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var name = '';
    var username = '';
    var phone = '';
    var address = '';
    var profile = '';
    this.subscriberModalTitle = "Add Subscriber";

    if (this.editFlag == true) {

      var pass=prompt("you need a password");
      console.log(pass)
      if(pass !== null){
      this.subscriberService.checkPass(pass).subscribe(Response => {

      name = SubscribersComponent.selectedRowData['name'];
      username = SubscribersComponent.selectedRowData['username'];
      phone = SubscribersComponent.selectedRowData['phone'];
      address = SubscribersComponent.selectedRowData['address'];
      profile = SubscribersComponent.selectedRowData['profile'];
      this.subscriberModalTitle = "Update Subscriber";

    }, error => {
      Swal("incorrect password");
      this.modalReference.close();
    });
  }else{
    this.modalReference.close();
  }
    }
    this.subscriberForm = this.fb.group({
      name: [name, Validators.required],
      username: [username, Validators.required],
      phone: [phone, Validators.required],
      address: [address, Validators.required],
      profile: [profile, Validators.required]
    });
  }

  addEditSubscriber() {
    debugger
    if (this.editFlag == true) {
      this.editedSubscriberData['name'] = this.name.value;
      this.editedSubscriberData['username'] =this.subscriberForm.value.username;
      this.editedSubscriberData['address'] = this.address.value;
      this.editedSubscriberData['phone'] = this.phoneNumber.value;
      this.editedSubscriberData['profile'] = this.profile.value;
      this.editedSubscriberData['id'] = SubscribersComponent.selectedSubscriberID;
      this.subscriberService.editSubscriber(this.editedSubscriberData).subscribe(Response => {
      this.globalSubscriberDataTable.ajax.reload(null, false);
      Swal({
        type: 'success',
        title: 'Success',
        text: 'Subscriber Updated Successfully',
        showConfirmButton: false,
        timer: 1000
      });
      }, error => {
        Swal({
          type: 'error',
          title: error.statusText,
          text: error.message
        });
      });
    }
    else {
      this.subscriberService.addNewSubscriber(this.subscriberForm.value).subscribe(Response => {
        this.globalSubscriberDataTable.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Success',
          text: 'Subscriber Added Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        Swal({
          type: 'error',
          title: error.statusText,
          text: error.message
        });
      });
    }
    this.modalReference.close();
  }
  toggleActivation() {
    var title = "Activate User";
    var text = "Do you want to <b> activate </b> this user ?"
    if (SubscribersComponent.selectedRowData['is_activated'] == 1) {
      text = "Do you want to <b> deactivate </b> this user ?";
      title = "Deactivate User";
    }

    Swal({
      title: title,
      html: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.subscriberService.toggleSubscriberActivation(SubscribersComponent.selectedSubscriberID).subscribe(Response => {
          this.globalSubscriberDataTable.ajax.reload(null, false);
          Swal({
            type: 'success',
            title: 'Success',
            text: 'User State Changed Successfully',
            showConfirmButton: false,
            timer: 1000
          });
        }, error => {
          Swal({
            type: 'error',
            title: error.statusText,
            text: error.message
          });
        });
      }
    });
  }

  togglePayment() {
    if (SubscribersComponent.selectedRowData['subDetID'] == '') {
      Swal({
        type: 'info',
        title: "This user isn't subscribed",
        text: 'Please resubscribe before changing payment state'
      });
      return;
    }
    var title = "Set Payment as Unpaid";
    var text = "Do you want to set this payment as <b> unpaid </b> ?"
    if (SubscribersComponent.selectedRowData['isPaid'] == 0) {
      title = "Set Payment as Paid";
      text = "Do you want to set this payment as <b>paid</b> ?"
    }
    Swal({
      title: title,
      html: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {


      if (result.value) {



        if(SubscribersComponent.selectedRowData['isPaid']==1){
          var pass=prompt("you need a password");
          this.subscriberService.checkPass(pass).subscribe(Response => {
            this.subscriberService.togglePayment(SubscribersComponent.selectedRowData['subDetID'], SubscribersComponent.selectedRowData['isPaid'],SubscribersComponent.selectedRowData['profile'],SubscribersComponent.selectedRowData['ID']).subscribe(Response => {
            this.globalSubscriberDataTable.ajax.reload(null, false);
            Swal({
              type: 'success',
              title: 'Success',
              text: 'Payment State Changed Successfully',
              showConfirmButton: false,
              timer: 1000
            });
          }, error => {
            Swal({
              type: 'error',
              title: error.statusText,
              text: error.message
            });
          });
            }, error => {
              Swal("incorrect password");
            });
        }else{
          this.subscriberService.togglePayment(SubscribersComponent.selectedRowData['subDetID'], SubscribersComponent.selectedRowData['isPaid'],SubscribersComponent.selectedRowData['profile'],SubscribersComponent.selectedRowData['ID']).subscribe(Response => {
            this.globalSubscriberDataTable.ajax.reload(null, false);
            Swal({
              type: 'success',
              title: 'Success',
              text: 'Payment State Changed Successfully',
              showConfirmButton: false,
              timer: 1000
            });
          }, error => {
            Swal({
              type: 'error',
              title: error.statusText,
              text: error.message
            });
          });
        }


      }


    });

  }
  navigateToSubsc() {
    localStorage.setItem('XOffset', window.pageXOffset.toString());
    localStorage.setItem('YOffset', window.pageYOffset.toString());
    this.router.navigate(['/subscription'], { queryParams: { searchName: SubscribersComponent.selectedRowData['name'] } });
  }

  resubscribeSubmit() {
    this.subscriberService.newSubscription(this.resubscribeForm.value).subscribe(Response => {
      this.globalSubscriberDataTable.ajax.reload(null, false);
      Swal({
        type: 'success',
        title: 'Success',
        text: 'Subscribtion Added Successfully',
        showConfirmButton: false,
        timer: 1000
      });
      var name = SubscribersComponent.selectedRowData['name'];
      var paid = 'Paid';
      var expDate = this.resubscribeForm.get('expDate').value ;

      if(this.resubscribeForm.get('isPaid').value == 0)
      {
        paid = 'Unpaid';
      }
      var message = "Resubscribe: "+name+ " "+paid +" and expires on "+ expDate;
      var xhr = new XMLHttpRequest();
      
      xhr.open("GET", "https://platform.clickatell.com/messages/http/send?apiKey=23-rATyZTUOytt8Kx3ETGg==&to=9613776132&content=" + message, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log('success');
        }
      };
      xhr.send();

    }, error => {
      Swal({
        type: 'error',
        title: error.statusText,
        text: error.message
      });
    });
    this.modalReference.close();
  }

  showMonths(invoicePayments) {


    this.spinner.show();

    this.dialogContextMenu = [
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('deleteSubscriberBtn') as HTMLElement;
          element.click();
        }

      },
      {
        label: 'Toggle Payment',
        icon: 'pi pi-fw pi-ban',
        command: (event) => {
          let element: HTMLElement = document.getElementById('togglePaymentBtn') as HTMLElement;
          element.click();
        }

      }
    ];
    this.subscriberService.getMonths(SubscribersComponent.selectedSubscriberID).subscribe(Response => {
      this.spinner.hide();
      this.subscriberMonths = Response;
      var invoicePaymentsDT = $('#subsMonths').DataTable({
        responsive: true,
        paging: true,
        pagingType: "full_numbers",
        serverSide: false,
        processing: true,
        select: {
          "style": "single"
        },
        ordering: true,
        stateSave: false,
        fixedHeader: false,
        searching: true,
        lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
        data: this.subscriberMonths,
        order: [[0, 'desc']],
        columns: [
          { data: "name", title: "Name" },
          { data: "profile", title: "Amount", render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') },
          { data: "sub_date", title: "Sub Date" },
          { data: "exp_date", title: "Exp Date" },
          { data: "is_activated", title: "Act" },
          { data: "is_paid", title: "Paid" }
        ]
      });

      invoicePaymentsDT.on('select', function (e, dt, type, indexes) {

        if (type === 'row') {
          SubscribersComponent.selectedRowData = invoicePaymentsDT.row(indexes).data();
          var data = invoicePaymentsDT.row(indexes).data()['ID'];
          SubscribersComponent.selectedSubscriberID = data;
        }
        else if (type === 'column') {
          SubscribersComponent.selectedSubscriberID = -1;
        }
      });

      $('#subsMonths tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          invoicePaymentsDT.row(this).select();
        }
      });

      $('#subsMonths').on('key-focus.dt', function (e, datatable, cell) {
        $(invoicePaymentsDT.row(cell.index().row).node()).addClass('selected');

      });
      $('#subsMonths').on('key-blur.dt', function (e, datatable, cell) {
        $(invoicePaymentsDT.row(cell.index().row).node()).removeClass('selected');
      });

    }, error => {
      this.spinner.hide();
      alert(error)
    });
    this.modalReference = this.modalService.open(invoicePayments, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
  }

  copyName() {
    var txtArea = document.createElement("textarea");
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = SubscribersComponent.selectedRowData['name'];
    document.body.appendChild(txtArea);
    txtArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      if (successful) {
        return true;
      }
    } catch (err) {
      console.log('Oops, unable to copy');
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

  openDebitPayment(debitPaymentModel){
    // var subID=SubscribersComponent.selectedRowData['subID'];
    // alert(SubscribersComponent.selectedRowData['ID'])
    this.debitPaymentForm = this.fb.group({
      paymentAmount: ['', Validators.required],
      subName: [SubscribersComponent.selectedRowData['name'], Validators.required],
      subID: [SubscribersComponent.selectedRowData['ID']],
    });
    // this.debitPaymentForm.subID= 
    console.log(this.debitPaymentForm.value)
    // this.debitPaymentForm = new FormGroup({
    //   paymentAmount: new FormControl(''),
    //   subID: new FormControl(''),
    // });
    debugger
    // this.subscriberName = SubscribersComponent.selectedRowData['name'];
    this.modalReference = this.modalService.open(debitPaymentModel, { centered: true, ariaLabelledBy: 'modal-basic-title' });
  }

  submitDebitPaymentAmount(){
    this.subscriberService.submitDebitPaymentAmount(this.debitPaymentForm.value).subscribe(Response => {
      this.globalSubscriberDataTable.ajax.reload(null, false);
      Swal({
        type: 'success',
        title: 'Success',
        text: 'Payment State Changed Successfully',
        showConfirmButton: false,
        timer: 1000
      });
    }, error => {
      Swal({
        type: 'error',
        title: error.statusText,
        text: error.message
      });
    });
    this.modalReference.close();
  }

  get name() {
    return this.subscriberForm.get('name');
  }
  get phoneNumber() {
    return this.subscriberForm.get('phone');
  }
  get address() {
    return this.subscriberForm.get('address');
  }
  get profile() {
    return this.subscriberForm.get('profile');
  }

}
