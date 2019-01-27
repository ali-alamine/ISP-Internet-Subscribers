import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormControl } from '../../../node_modules/@angular/forms';
declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';
import { MenuItem } from '../../../node_modules/primeng/api';
import { StockService } from './stock.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  accItems: MenuItem[];
  MRCItems: MenuItem[];
  OFItems: MenuItem[];
  CTItems: MenuItem[];
  private globalAccDataTable;
  private globalMRCDataTable;
  private globalOFDataTable;
  private globalMCDataTable;
  private static selectedRowDataAcc;
  private static selectedRowDataMRC;
  private static selectedRowDataOF;
  private static selectedRowDataCT;
  private static selectedAccID: number;
  private static selectedMRCID: number;
  private static selectedOFID: number;
  private static selectedCTID: number;
  private accForm;
  private MRCForm;
  private OFForm;
  private CTForm;
  modalReference: any;
  private accModalTitle;
  private accModalType;
  private MRCModalTitle;
  private MRCModalType;
  private OFModalTitle;
  private OFModalType;
  private CTModalTitle;
  disableSelect = new FormControl(false);
  accEdit = true;
  MRCEdit = true;
  OFEdit = true;
  accEditedData = {};
  MRCEditedData = {};
  OFEditedData = {};
  CTEditedData = {};

  constructor(private modalService: NgbModal,
  private fb: FormBuilder,
  private stockService: StockService) { }
  ngOnInit() {
    
    this.accItems = [{
      label: 'Edit',
      icon: 'pi pi-fw pi-pencil',
      command: (event) => {
        let element: HTMLElement = document.getElementById('accEditBtn') as HTMLElement;
        element.click();
      }
    }];
    // this.MRCItems = [{
    //   label: 'Edit',
    //   icon: 'pi pi-fw pi-pencil',
    //   command: (event) => {
    //     let element: HTMLElement = document.getElementById('MRCEditBtn') as HTMLElement;
    //     element.click();
    //   }
    // }];
    // this.OFItems = [{
    //   label: 'Edit',
    //   icon: 'pi pi-fw pi-pencil',
    //   command: (event) => {
    //     let element: HTMLElement = document.getElementById('OFEditBtn') as HTMLElement;
    //     element.click();
    //   }
    // }];
    // this.CTItems = [{
    //   label: 'Edit',
    //   icon: 'pi pi-fw pi-pencil',
    //   command: (event) => {
    //     let element: HTMLElement = document.getElementById('CTEditBtn') as HTMLElement;
    //     element.click();
    //   }
    // }];
  }
  ngAfterViewInit(){
    this.tabChanged(1);
  }
  tabChanged = (tabChangeEvent): void => {
    if(tabChangeEvent==0){
      this.viewStockMRCDT();
    }
    if(tabChangeEvent==1){
      this.viewStockAccDT();
    }
    if(tabChangeEvent==2){
      this.viewStockOFDT();
    }
    if(tabChangeEvent==3){
      this.viewStockMCDT();
    }
  }
  viewStockAccDT(){
    if(this.globalAccDataTable==null){
    var stockAccDT = $('#stockAccDT').DataTable({
      buttons: ["print"],
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: true,      
      autoWidth: true,
      select: {
        "style": "single"
      },
      searching: true,
      lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url: "http://localhost/e-safe-data/src/assets/api/dataTables/stockDataTable.php",
        data:{"type":"AC"},
        cache: false,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "name", title: "NAME" },
        { data: "quantity", title: "QUANTITY" ,"searchable": false,"sortable": false },
        { data: "cost", title: "COST" ,"searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') },
        { data: "price", title: "PRICE" ,"searchable": false,"sortable": false  , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }

      ]
    });
    this.globalAccDataTable=stockAccDT;
    stockAccDT.on('select', function (e, dt, type, indexes) {
      if (type === 'row') {
        StockComponent.selectedRowDataAcc = stockAccDT.row(indexes).data();
        var data = stockAccDT.row(indexes).data()['ID'];
        StockComponent.selectedAccID = data;
      }
      else if (type === 'column') {
      StockComponent.selectedAccID = -1;
      }
    });
    $('#stockAccDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        stockAccDT.row(this).select();
      }
    });
    $('#stockAccDT').on('key-focus.dt', function (e, datatable, cell) {
      $(stockAccDT.row(cell.index().row).node()).addClass('selected');
    });
    $('#stockAccDT').on('key-blur.dt', function (e, datatable, cell) {
      $(stockAccDT.row(cell.index().row).node()).removeClass('selected');
    });
    }else{
      this.globalAccDataTable.ajax.reload(null, false);
    }
  }
  viewStockMRCDT(){
    if(this.globalMRCDataTable==null){
      var stockMRCDT = $('#stockMRCDT').DataTable({
        buttons: ["print"],
        responsive: false,
        paging: true,
        pagingType: "full_numbers",
        serverSide: true,
        processing: true,
        ordering: true,
        stateSave: true,      
        autoWidth: true,
        select: {
          "style": "single"
        },
        searching: true,
        lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
        ajax: {
          type: "get",
          url: "http://localhost/e-safe-data/src/assets/api/dataTables/stockDataTable.php",
          data:{"type":"RC"},
          cache: false,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          { data: "name", title: "CARD NAME" },
          { data: "company", title: "COMPANY" },
          { data: "quantity", title: "QUANTITY","searchable": false,"sortable": false },
          { data: "cost", title: "COST","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') },
          { data: "price", title: "PRICE","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }
  
        ]
      });
      this.globalMRCDataTable=stockMRCDT;
      stockMRCDT.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
          StockComponent.selectedRowDataMRC = stockMRCDT.row(indexes).data();
          var data = stockMRCDT.row(indexes).data()['ID'];
          StockComponent.selectedMRCID = data;
        }
        else if (type === 'column') {
        StockComponent.selectedMRCID = -1;
        }
      });
      $('#stockMRCDT tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          stockMRCDT.row(this).select();
        }
      });
      $('#stockMRCDT').on('key-focus.dt', function (e, datatable, cell) {
        $(stockMRCDT.row(cell.index().row).node()).addClass('selected');
      });
      $('#stockMRCDT').on('key-blur.dt', function (e, datatable, cell) {
        $(stockMRCDT.row(cell.index().row).node()).removeClass('selected');
      });
    } else{
      this.globalMRCDataTable.ajax.reload(null, false);
    }
  }
  viewStockOFDT(){
    if(this.globalOFDataTable==null){
      var stockOFDT = $('#stockOFDT').DataTable({
        buttons: ["print"],
        responsive: false,
        paging: true,
        pagingType: "full_numbers",
        serverSide: true,
        processing: true,
        ordering: true,
        stateSave: true,      
        autoWidth: true,
        select: {
          "style": "single"
        },
        searching: true,
        lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
        ajax: {
          type: "get",
          url: "http://localhost/e-safe-data/src/assets/api/dataTables/stockDataTable.php",
          data:{"type":"OF"},
          cache: false,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          { data: "name", title: "OFFERS NAME" },
          { data: "company", title: "COMPANY" },
          { data: "num_of_mounth", title: "NB. OF MOUNTH","searchable": false,"sortable": false },
          { data: "num_of_credit", title: "NB. OF CREDITS $","searchable": false,"sortable": false },
          { data: "price", title: "PRICE","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }
        ]
      });
      this.globalOFDataTable=stockOFDT;
      stockOFDT.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
          StockComponent.selectedRowDataOF = stockOFDT.row(indexes).data();
          var data = stockOFDT.row(indexes).data()['ID'];
          StockComponent.selectedOFID = data;
        }
        else if (type === 'column') {
        StockComponent.selectedOFID = -1;
        }
      });
      $('#stockOFDT tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          stockOFDT.row(this).select();
        }
      });
      $('#stockOFDT').on('key-focus.dt', function (e, datatable, cell) {
        $(stockOFDT.row(cell.index().row).node()).addClass('selected');
      });
      $('#stockOFDT').on('key-blur.dt', function (e, datatable, cell) {
        $(stockOFDT.row(cell.index().row).node()).removeClass('selected');
      });
    } else{
      this.globalOFDataTable.ajax.reload(null, false);
    }
  }
  viewStockMCDT(){    
    if(this.globalMCDataTable==null){
      var stockMCDT = $('#stockMCDT').DataTable({
        buttons: ["print"],
        responsive: false,
        paging: true,
        pagingType: "full_numbers",
        serverSide: true,
        processing: true,
        ordering: true,
        stateSave: false,      
        autoWidth: false,
        select: {
          "style": "single"
        },
        searching: false,
        ajax: {
          type: "get",
          url: "http://localhost/e-safe-data/src/assets/api/dataTables/stockDataTable.php",
          data:{"type":"CT"},
          cache: false,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          { data: "name", title: "COMPANY","searchable": false,"sortable": false },
          { data: "credits", title: "$","searchable": false,"sortable": false }
        ]
      });
      this.globalMCDataTable=stockMCDT;
      stockMCDT.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
          StockComponent.selectedRowDataCT = stockMCDT.row(indexes).data();
          var data = stockMCDT.row(indexes).data()['ID'];
          StockComponent.selectedCTID = data;
        }
        else if (type === 'column') {
        StockComponent.selectedCTID = -1;
        }
      });
    } else{
      this.globalMCDataTable.ajax.reload(null, false);
    }
  }
  openAccModal(accModal, edit) {
    this.modalReference = this.modalService.open(accModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var accName = '';
    var accPrice = '';
    var accBarCode = '';
    this.accModalTitle = "NEW Accessories";
    this.accModalType = "Add";
    this.accEdit=false;

    if (edit == true) {
      this.accEdit=true;
      accName = StockComponent.selectedRowDataAcc['name'];
      accPrice = StockComponent.selectedRowDataAcc['price'];
      accBarCode = StockComponent.selectedRowDataAcc['bar_code'];
      this.accModalTitle = "Update Accessories";
      this.accModalType = "Update";
    }
    this.accForm = this.fb.group({
      name: [accName, Validators.required],
      price: accPrice,
      bar_code: [accBarCode]
    });
  }
  openMRCModal(MRCModal, MRCEdit) {
    this.modalReference = this.modalService.open(MRCModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    if (MRCEdit == true) {
      this.MRCEdit = true;
      this.MRCModalTitle = "UPDATE RECHARGE CARD";
      this.MRCModalType = "Update";
      this.MRCForm = this.fb.group({
        name: [StockComponent.selectedRowDataMRC['name'], Validators.required],
        price: StockComponent.selectedRowDataMRC['price'],
        bar_code: StockComponent.selectedRowDataMRC['bar_code']
      });
    } else{
      this.MRCEdit = false;
      this.MRCModalTitle = "NEW RECHARGE CARD";
      this.MRCModalType = "Add";
      this.MRCForm = this.fb.group({
        name: ['', Validators.required],
        company: ['', Validators.required],
        price: '',
        bar_code: ''
      });
    }
  }
  openOFModal(OFModal, OFEdit) {
    this.modalReference = this.modalService.open(OFModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    if (OFEdit == true) {
      this.OFEdit = true;
      this.OFModalTitle = "UPDATE OFFERS";
      this.OFModalType = "Update";
      this.OFForm = this.fb.group({
        name: [StockComponent.selectedRowDataOF['name'], Validators.required],
        num_of_mounth: StockComponent.selectedRowDataOF['num_of_mounth'],
        num_of_credit: StockComponent.selectedRowDataOF['num_of_credit'],
        price: StockComponent.selectedRowDataOF['price'],
        bar_code: StockComponent.selectedRowDataOF['bar_code']
      });
    } else{
      this.OFEdit = false;
      this.OFModalTitle = "NEW OFFERS";
      this.OFModalType = "Add";
      this.OFForm = this.fb.group({
        name: ['', Validators.required],
        company: ['', Validators.required],
        num_of_mounth: 1,
        num_of_credit: '',
        price: '',
        bar_code: ''
      });
    }
  }
  openCTModal(CTModal) {
    this.modalReference = this.modalService.open(CTModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
      this.CTModalTitle = "UPDATE CREDITS "+StockComponent.selectedRowDataCT['name'];
      this.CTForm = this.fb.group({
        IID: [StockComponent.selectedCTID, Validators.required],
        credits: [StockComponent.selectedRowDataCT['credits'], Validators.required]
      });
  }
  addEditAcc() {
    if (this.accEdit == true) {
      this.accEdit = true;
      this.accEditedData['name'] = this.accName.value;
      this.accEditedData['price'] = this.accPrice.value;
      this.accEditedData['bar_code'] = this.accBarCode.value;
      this.accEditedData['IID'] = StockComponent.selectedAccID;
      this.stockService.editAcc(this.accEditedData).subscribe(Response => {
      this.globalAccDataTable.ajax.reload(null, false);
      swal({
        type: 'success',
        title: 'Success',
        text:'Edit Accessories Successfully',
        showConfirmButton: false,
        timer: 1000
      });
    }, error => {
      swal({
        type: 'error',
        title: error.statusText,
        text:error.message
      });
      });
    }
    else {
      this.accEdit = false;
      this.stockService.addNewAcc(this.accForm.value).subscribe(Response => {
        this.globalAccDataTable.ajax.reload(null, false);
        swal({
          type: 'success',
          title: 'Success',
          text:'Add Accessories Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        swal({
          type: 'error',
          title: error.statusText,
          text:error.message
        });
      });
    }
    this.modalReference.close();
  }
  addEditMRC() {
    if (this.MRCEdit == true) {
      this.MRCEdit = true;
      this.MRCEditedData['name'] = this.MRCName.value;
      this.MRCEditedData['price'] = this.MRCPrice.value;
      this.MRCEditedData['bar_code'] = this.MRCBarCode.value;
      this.MRCEditedData['IID'] = StockComponent.selectedMRCID;
      this.stockService.editMRC(this.MRCEditedData).subscribe(Response => {
        this.globalMRCDataTable.ajax.reload(null, false);
        swal({
          type: 'success',
          title: 'Success',
          text:'Edit Recharge Card Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        swal({
          type: 'error',
          title: error.statusText,
          text:error.message
        });
      });
    }
    else {
      this.MRCEdit = false;
      this.stockService.addNewMRC(this.MRCForm.value).subscribe(Response => {
        this.globalMRCDataTable.ajax.reload(null, false);
        swal({
          type: 'success',
          title: 'Success',
          text:'Add Recharge Card Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        swal({
          type: 'error',
          title: error.statusText,
          text:error.message
        });
      });
    }
    this.modalReference.close();
  }
  addEditOF() {
    if (this.OFEdit == true) {
      this.OFEdit = true;
      this.OFEditedData['name'] = this.OFName.value;
      this.OFEditedData['num_of_mounth'] = this.OFNumOfMounth.value;
      this.OFEditedData['num_of_credit'] = this.OFNumOfCredit.value;
      this.OFEditedData['price'] = this.OFPrice.value;
      this.OFEditedData['bar_code'] = this.OFBarCode.value;
      this.OFEditedData['IID'] = StockComponent.selectedOFID;
      this.stockService.editOF(this.OFEditedData).subscribe(Response => {
        this.globalOFDataTable.ajax.reload(null, false);
        swal({
          type: 'success',
          title: 'Success',
          text:'Edit Offers Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        swal({
          type: 'error',
          title: error.statusText,
          text:error.message
        });
      });
    }
    else {
      this.OFEdit = false;
      this.stockService.addNewOF(this.OFForm.value).subscribe(Response => {
        this.globalOFDataTable.ajax.reload(null, false);
        swal({
          type: 'success',
          title: 'Success',
          text:'Add Offers Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        swal({
          type: 'error',
          title: error.statusText,
          text:error.message
        });
      });
    }
    this.modalReference.close();
  }
  editCT() {
    this.stockService.editCT(this.CTForm.value).subscribe(Response => {
      this.globalMCDataTable.ajax.reload(null, false);
      swal({
        type: 'success',
        title: 'Success',
        text:'Edit Credits Successfully',
        showConfirmButton: false,
        timer: 1000
      });
    }, error => {
      swal({
        type: 'error',
        title: error.statusText,
        text:error.message
      });
    });
    this.modalReference.close();
  }
  get accName() {
    return this.accForm.get('name');
  }
  get accPrice() {
    return this.accForm.get('price');
  }
  get accBarCode() {
    return this.accForm.get('bar_code');
  }
  get MRCName(){
    return this.MRCForm.get('name');
  }
  get MRCCompany(){
    return this.MRCForm.get('company');
  }
  get MRCPrice(){
    return this.MRCForm.get('price');
  }
  get MRCBarCode(){
    return this.MRCForm.get('bar_code');
  }
  get OFName(){
    return this.OFForm.get('name');
  }
  get OFCompany(){
    return this.OFForm.get('company');
  }
  get OFNumOfMounth(){
    return this.OFForm.get('num_of_mounth');
  }
  get OFNumOfCredit(){
    return this.OFForm.get('num_of_credit');
  }
  get OFPrice(){
    return this.OFForm.get('price');
  }
  get OFBarCode(){
    return this.OFForm.get('bar_code');
  }
}
