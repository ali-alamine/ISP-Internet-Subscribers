import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientsService } from './clients.service';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  modalReference: any;
  private clientForm;
  private paymentForm;
  paymentModalTitle;
  clientModalTitle;
  editFlag=false;
  subscriberModalTitle;
  private static selectedRowData;
  private static selectedClientID;
  private static selectedClientName;
  editedClientData = {};
  items: MenuItem[];
  private globalClientsDT;
  totalDebit;

  constructor(private modalService: NgbModal, private fb: FormBuilder,private clientsService:ClientsService) { }

  ngOnInit() {
    var subscriberDataTable = $('#clientsDT').DataTable({
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
        url: "http://localhost/e-safe-data/src/assets/api/dataTables/clientsDataTable.php",
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
        { data: "debit", title: "Debit" , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }
        // { data: "omt_debit", title: "OMT Debit" , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }

      ]
    });

    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editClientBtn') as HTMLElement;
          element.click();
        }

      }, {
        label: 'New Payment',
        icon: 'pi pi-fw pi-plus',
        command: (event) => {
          let element: HTMLElement = document.getElementById('newPaymentBtn') as HTMLElement;
          element.click();
        }

      }
    ];
    this.globalClientsDT = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        ClientsComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        var ID = subscriberDataTable.row(indexes).data()['ID'];
        var name = subscriberDataTable.row(indexes).data()['name'];
        ClientsComponent.selectedClientID = ID;
        ClientsComponent.selectedClientName = name;
      }
      else if (type === 'column') {
        ClientsComponent.selectedClientID = -1;
      }
    });

    $('#clientsDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $('#clientsDT').on('key-focus.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#clientsDT').on('key-blur.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
    });

    this.getTotalDebit();
  }

  openClientModal(clientModal){
    this.modalReference = this.modalService.open(clientModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var name = '';
    var phone = '';
    var address = '';
    this.clientModalTitle = "Add Client";

    if (this.editFlag == true) {
      name = ClientsComponent.selectedRowData['name'];
      phone = ClientsComponent.selectedRowData['phone'];
      address = ClientsComponent.selectedRowData['address'];
      this.subscriberModalTitle = "Update Client";
    }
    this.clientForm = this.fb.group({
      name: [name, Validators.required],
      phone: [phone, Validators.required],
      address: [address, Validators.required]
    });

  }

  addEditClient() {
    if (this.editFlag == true) {
      this.editedClientData['name'] = this.name.value;
      this.editedClientData['address'] = this.address.value;
      this.editedClientData['phone'] = this.phoneNumber.value;
      this.editedClientData['id'] = ClientsComponent.selectedClientID;

      console.log(this.editedClientData)
      this.clientsService.editClient(this.editedClientData).subscribe(Response => {
        this.globalClientsDT.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Success',
          text: 'Client Updated Successfully',
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
      this.clientsService.addNewClient(this.clientForm.value).subscribe(Response => {
        this.globalClientsDT.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Success',
          text: 'Client Added Successfully',
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

  openNewPaymentModal(paymentModal){
    this.modalReference = this.modalService.open(paymentModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var amount = '';
    this.paymentModalTitle = "New Payment";

    
    this.paymentForm = this.fb.group({
      drawer:['M',Validators.required],
      amount: [amount, [Validators.required,Validators.max(ClientsComponent.selectedRowData['debit'])]],
      clientID:[ClientsComponent.selectedClientID],
      clientName:[ClientsComponent.selectedClientName]
    });

  }

  addNewPayment(){
    this.clientsService.newPayment(this.paymentForm.value).subscribe(Response => {
      this.globalClientsDT.ajax.reload(null, false);
      Swal({
        type: 'success',
        title: 'Success',
        text: 'Payment Submited Successfully',
        showConfirmButton: false,
        timer: 1000
      });
      this.getTotalDebit();
    }, error => {
      Swal({
        type: 'error',
        title: error.statusText,
        text: error.message
      });
    });
    this.modalReference.close();
  }

  getTotalDebit(){
    this.clientsService.totalDebit().subscribe(Response => {
      this.totalDebit=Response[0].debit;
    }, error => {
      Swal({
        type: 'error',
        title: error.statusText,
        text: error.message
      });
    });
  }

  get name() {
    return this.clientForm.get('name');
  }
  get phoneNumber() {
    return this.clientForm.get('phone');
  }
  get address() {
    return this.clientForm.get('address');

  }
  get amount() {
    return this.paymentForm.get('amount');

  }
  get drawer() {
    return this.paymentForm.get('drawer');

  }

}
