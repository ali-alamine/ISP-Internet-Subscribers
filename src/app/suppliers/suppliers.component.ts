import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { SuppliersService } from './suppliers.service';
import { Router } from '@angular/router';
declare var $: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  modalReference: any;
  private supplierForm;
  private paymentForm;
  paymentModalTitle;
  supplierModalTitle;
  editFlag=false;
  subscriberModalTitle;
  private static selectedRowData;
  private static selectedsupplierID;
  editedSupplierData = {};
  items: MenuItem[];
  private globalsuppliersDT;

  constructor(private modalService: NgbModal, private fb: FormBuilder,private suppliersService:SuppliersService,private router: Router) { }

  ngOnInit() {
    var suppliersDataTable = $('#suppliersDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: {
        "style": "single"
      },
      searching: true,
      lengthMenu: [[50, 100, 150, 200, 300], [50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url: "http://localhost/e-safe-data/src/assets/api/dataTables/suppliersDataTable.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "ID", title: "ID" },
        { data: "name", title: "Name" },
        { data: "phone", title: "Phone" },
        { data: "address", title: "Address" },
        { data: "debit", title: "Debit",render:$.fn.dataTable.render.number( ',', '.', 0, 'LL ' )}

      ]
    });

    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editSupplierBtn') as HTMLElement;
          element.click();
        }

      },
      {
        label: 'Show Invoices',
        icon: 'pi pi-fw pi-tag',
        command: (event) => {
          let element: HTMLElement = document.getElementById('showSupInvoices') as HTMLElement;
          element.click();
        }

      }
    ];
    this.globalsuppliersDT = suppliersDataTable;

    suppliersDataTable.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        SuppliersComponent.selectedRowData = suppliersDataTable.row(indexes).data();
        var data = suppliersDataTable.row(indexes).data()['ID'];
        SuppliersComponent.selectedsupplierID = data;
      }
      else if (type === 'column') {
        SuppliersComponent.selectedsupplierID = -1;
      }
    });

    $('#suppliersDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        suppliersDataTable.row(this).select();
      }
    });

    $('#suppliersDT').on('key-focus.dt', function (e, datatable, cell) {
      $(suppliersDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#suppliersDT').on('key-blur.dt', function (e, datatable, cell) {
      $(suppliersDataTable.row(cell.index().row).node()).removeClass('selected');
    });
  }

  openSupplierModal(supplierModal){
    this.modalReference = this.modalService.open(supplierModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var name = '';
    var phone = '';
    var address = '';
    this.supplierModalTitle = "Add supplier";

    if (this.editFlag == true) {
      name = SuppliersComponent.selectedRowData['name'];
      phone = SuppliersComponent.selectedRowData['phone'];
      address = SuppliersComponent.selectedRowData['address'];
      this.supplierModalTitle  = "Update supplier";
    }
    this.supplierForm = this.fb.group({
      name: [name, Validators.required],
      phone: [phone, Validators.required],
      address: [address, Validators.required]
    });

  }

  addEditSupplier() {
    if (this.editFlag == true) {
      this.editedSupplierData['name'] = this.name.value;
      this.editedSupplierData['address'] = this.address.value;
      this.editedSupplierData['phone'] = this.phoneNumber.value;
      this.editedSupplierData['id'] = SuppliersComponent.selectedsupplierID;      
      this.suppliersService.editSupplier(this.editedSupplierData).subscribe(Response => {
        this.globalsuppliersDT.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Success',
          text:'Supplier Updated Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        Swal({
          type: 'error',
          title: error.statusText,
          text:error.message
        });
      });
    }
    else {
      this.suppliersService.addNewSupplier(this.supplierForm.value).subscribe(Response => {
        this.globalsuppliersDT.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Success',
          text:'Supplier Added Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        Swal({
          type: 'error',
          title: error.statusText,
          text:error.message
        });
      });
    }

    this.modalReference.close();
  }

  openNewPaymentModal(paymentModal){
    this.modalReference = this.modalService.open(paymentModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var amount = '';
    this.paymentModalTitle = "New Payment";

    
    this.paymentForm = this.fb.group({
      amount: [amount, [Validators.required,Validators.max(SuppliersComponent.selectedRowData['debit'])]],
      supplierID:[SuppliersComponent.selectedsupplierID]
    });

  }

  addNewPayment(){
    this.suppliersService.newPayment(this.paymentForm.value).subscribe(Response => {
      this.globalsuppliersDT.ajax.reload(null, false);
      alert(Response)
    }, error => {
      alert(error)
    });
    this.modalReference.close();
  }

  navigateToInvoices() {
    this.router.navigate(['/supplyInvoices'], { queryParams: { searchName: SuppliersComponent.selectedRowData['name'] } });
  }

  get name() {
    return this.supplierForm.get('name');
  }
  get phoneNumber() {
    return this.supplierForm.get('phone');
  }
  get address() {
    return this.supplierForm.get('address');

  }
  get amount() {
    return this.paymentForm.get('amount');

  }

}

