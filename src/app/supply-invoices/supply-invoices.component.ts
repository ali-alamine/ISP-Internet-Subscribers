import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplyInvoicesService } from './supply-invoices.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
declare var $: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-supply-invoices',
  templateUrl: './supply-invoices.component.html',
  styleUrls: ['./supply-invoices.component.css']
})
export class SupplyInvoicesComponent implements OnInit {
  private sub;
  modalReference: any;
  private supplierForm;
  private paymentForm;
  paymentModalTitle;
  supplierModalTitle;
  editFlag = false;
  subscriberModalTitle;
  private static selectedRowData;
  private static selectedInvoiceID;
  private static selectedsupplierID;
  editedSupplierData = {};
  items: MenuItem[];
  invoiceDetails;
  invoicePaymentDetails;
  private searchName;
  private globalsupplyInvoicesDT;


  constructor(private modalService: NgbModal, private supplyInvoicesService: SupplyInvoicesService,private spinner: NgxSpinnerService,private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.searchName = params['searchName'] || '-1';
    });

    var supplyInvoicesDT = $('#supplyInvoicesDT').DataTable({
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
      lengthMenu: [[25, 50, 100, 150, 200, 300], [ 25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url: "http://localhost/e-safe-data/src/assets/api/dataTables/supplyInvoiceDT.php",
        data: {},
        cache: true,
        async: true
      },
      
      
      order: [[0, 'asc']],
      columns: [
        { data: "ID", title: "ID" },
        { data: "name", title: "Name" },
        { data: "type", title: "Type" },
        { data: "drawer", title: "Drawer" },
        { data: "invDate", title: "Invoice Date" },
        { data: "totalCost", title: "Total", render:$.fn.dataTable.render.number( ',', '.', 0, 'LL ' ) },
        { data: "rest", title: "Remaining" , render:$.fn.dataTable.render.number( ',', '.', 0, 'LL ' ) }

      ],
      "columnDefs": [
        {
          "targets": 2,
          "data": "type",
          "render": function (data, type, row, meta) {
            if (data == 'RC') {
              return 'Recharge Card';
            }
            else if (data == 'AC') {
              return 'Accessories';
            }
            else {
              return '';
            }

          }
        },
        {
          "targets": 3,
          "data": "drawer",
          "render": function (data, type, row, meta) {
            if (data == 'M') {
              return 'Mobile Credit';

            }
            else {
              return 'Internet';
            }

          }
        }

      ]
    });

    if (this.searchName != '-1') {
      supplyInvoicesDT.search(this.searchName).draw();
    }

    this.items = [
      {
        label: 'Show Details',
        icon: 'pi pi-fw pi-bars',
        command: (event) => {
          let element: HTMLElement = document.getElementById('showInvoiceDetails') as HTMLElement;
          element.click();
        }

      }, {
        label: 'New Payment',
        icon: 'pi pi-fw pi-plus',
        command: (event) => {
          let element: HTMLElement = document.getElementById('newPaymentBtn') as HTMLElement;
          element.click();
        }

      }, {
        label: 'Show Payments',
        icon: 'pi pi-fw pi-info',
        command: (event) => {
          let element: HTMLElement = document.getElementById('showPaymentsBtn') as HTMLElement;
          element.click();
        }

      }
    ];

    this.globalsupplyInvoicesDT = supplyInvoicesDT;

    supplyInvoicesDT.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        SupplyInvoicesComponent.selectedRowData = supplyInvoicesDT.row(indexes).data();
        var data = supplyInvoicesDT.row(indexes).data()['ID'];
        SupplyInvoicesComponent.selectedInvoiceID = data;
        SupplyInvoicesComponent.selectedsupplierID = supplyInvoicesDT.row(indexes).data()['PID'];
      }
      else if (type === 'column') {
        SupplyInvoicesComponent.selectedInvoiceID = -1;
      }
    });

    $('#supplyInvoicesDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        supplyInvoicesDT.row(this).select();
      }
    });

    $('#supplyInvoicesDT').on('key-focus.dt', function (e, datatable, cell) {
      $(supplyInvoicesDT.row(cell.index().row).node()).addClass('selected');

    });
    $('#supplyInvoicesDT').on('key-blur.dt', function (e, datatable, cell) {
      $(supplyInvoicesDT.row(cell.index().row).node()).removeClass('selected');
    });
  }

  openInvoiceDetails(invoiceDetails) {
    this.spinner.show();
    this.supplyInvoicesService.getInvoiceDetails(SupplyInvoicesComponent.selectedInvoiceID).subscribe(Response => {
      this.spinner.hide();
      this.invoiceDetails=Response;
      var supplyInvoicesDT = $('#invoiceDetailsDT').DataTable({
        responsive: true,
        paging: true,
        pagingType: "full_numbers",
        serverSide: false,
        processing: true,
        ordering: true,
        stateSave: false,
        fixedHeader: false,
        searching: true,
        lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
        data: this.invoiceDetails,
        order: [[0, 'asc']],
        columns: [
          
          { data: "name", title: "Name" },
          { data: "cost", title: "cost" , render:$.fn.dataTable.render.number( ',', '.', 0, 'LL ' ) },
          { data: "quantity", title: "quantity" }
  
        ]
      });
    }, error => {
      this.spinner.hide();
      alert(error)
    });
    this.modalReference = this.modalService.open(invoiceDetails, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });    
  }

  openNewPaymentModal(paymentModal){
    if(SupplyInvoicesComponent.selectedRowData['rest']<=0)
    {
      Swal({
        type: 'info',
        title: "No remaining amount in this invoice"
      });
      return;
    }
    
    this.modalReference = this.modalService.open(paymentModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var amount = '';
    var comment="";
    this.paymentModalTitle = "New Payment";

    
    this.paymentForm = this.fb.group({
      amount: [amount, [Validators.required,Validators.max(SupplyInvoicesComponent.selectedRowData['rest']),Validators.min(1)]],
      comment:[comment],
      supplierID:[SupplyInvoicesComponent.selectedsupplierID],
      invoiceID:[SupplyInvoicesComponent.selectedInvoiceID],
      drawerType:['A',Validators.required]
    });

  }

  addNewPayment(){
    console.log(this.paymentForm.value)
    this.supplyInvoicesService.newPayment(this.paymentForm.value).subscribe(Response=>{
      Swal({
        type: 'success',
        title: 'Success',
        text: 'Payment Added Successfully',
        showConfirmButton: false,
        timer: 1000
      });
      this.globalsupplyInvoicesDT.ajax.reload(null, false);
    }, error => {
      Swal({
        type: 'error',
        title: error.statusText,
        text: error.message
      });
    });
    this.modalReference.close();

    
  }


  showInvoicePayments(invoicePayments) {
    this.spinner.show();
    this.supplyInvoicesService.getInvoicePayments(SupplyInvoicesComponent.selectedInvoiceID).subscribe(Response => {
      this.spinner.hide();
      this.invoicePaymentDetails=Response;
      var invoicePaymentsDT = $('#invoicePaymentsDT').DataTable({
        responsive: true,
        paging: true,
        pagingType: "full_numbers",
        serverSide: false,
        processing: true,
        ordering: true,
        stateSave: false,
        fixedHeader: false,
        searching: true,
        lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
        data: this.invoicePaymentDetails,
        order: [[0, 'desc']],
        columns: [
          
          { data: "payment_date", title: "Payment Date" },
          { data: "amount", title: "Amount" , render:$.fn.dataTable.render.number( ',', '.', 0, 'LL ' ) },
          { data: "comment", title: "Comment" }
  
        ]
      });
    }, error => {
      this.spinner.hide();
      alert(error)
    });
    this.modalReference = this.modalService.open(invoicePayments, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });    
  }

}
