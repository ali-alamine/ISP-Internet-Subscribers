import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OmtService } from "./omt.service";
import swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-omt",
  templateUrl: "./omt.component.html",
  styleUrls: ["./omt.component.css"]
})
export class OmtComponent implements OnInit {
  modalReference: any;

  wuForm;
  intraForm;
  billForm;
  ctbForm;
  extraForm;

  options;

  intraIsDollar = true;
  billIsDollar = true;
  ctbIsDollar = true;
  static globalomtDT: any;
  static searchCriteria = new Array(7);
  items: { label: string; icon: string; command: (event: any) => void }[];
  static selectedTranID: number;
  static selectedRowData: any;
  extraIsDollar: boolean;
  totalsArray;
  totalWesternUnionMinus = 0;
  totalWesternUnionPlus = 0;
  totalIntraPlus = 0;
  totalIntraMinus = 0;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private omtService: OmtService
  ) {}

  ngOnInit() {
    // $("#omtDT thead tr")
    //   .clone(true)
    //   .appendTo("#omtDT thead");
    // $("#omtDT thead tr:eq(1) th").each(function(i) {
    //   var title = $(this).text();
    //   $(this).html(
    //     '<input class="dtSearchHeader" type="text" placeholder="Search ' +
    //       title +
    //       '" />'
    //   );

    //   $("input", this).on("keyup change", function() {
    //     if (i == 0) OmtComponent.searchCriteria[0] = this.value;
    //     else if (i == 1) OmtComponent.searchCriteria[1] = this.value;
    //     else if (i == 2) OmtComponent.searchCriteria[2] = this.value;
    //     else if (i == 3) OmtComponent.searchCriteria[3] = this.value;
    //     else if (i == 4) OmtComponent.searchCriteria[4] = this.value;
    //     else if (i == 5) OmtComponent.searchCriteria[5] = this.value;
    //     else if (i == 6) OmtComponent.searchCriteria[6] = this.value;

    //     OmtComponent.globalomtDT.ajax.reload();
    //   });
    // });
    this.getTotalOperations();
    var omtDataTable = $("#omtDT").DataTable({
      responsive: false,
      orderCellsTop: true,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      searching: false,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: {
        style: "single"
      },
      lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url:
          "http://localhost/e-safe-data/src/assets/api/dataTables/omtTodayDT.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[0, "desc"]],
      columns: [
        { data: "oper_time", title: "Time" },
        { data: "oper_type", title: "Type" },
        { data: "oper_tran_type", title: "+/-" },
        {
          data: "oper_amount_d",
          title: "$",
          render: $.fn.dataTable.render.number(",", ".", 0, "$ ")
        },
        {
          data: "oper_amount_l",
          title: "L.L",
          render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
        },
        { data: "oper_is_paid", title: "Paid" },
        { data: "name", title: "Client Name" }
      ],

      columnDefs: [
        {
          targets: 1,
          data: "oper_type",
          render: function(data, type, row, meta) {
            if (data == "wu") {
              return '<span style="color:blue">Western Union</span>';
            } else if (data == "in") {
              return '<span  style="color:red">Intra OMT</span>';
            } else if (data == "bill") {
              return '<span  style="color:green">Bill</span>';
            } else if (data == "ctb") {
              return '<span  style="color:orange">Cash to Business</span>';
            } else if (data == "ext") {
              return '<span  style="color:black">Extra</span>';
            }
          }
        },
        {
          targets: 2,
          data: "is_activated",
          render: function(data, type, row, meta) {
            if (data == "p") {
              return '<span  style="color:blue">+</span>';
            } else {
              return '<span  style="color:red">-</span>';
            }
          }
        },
        {
          targets: 5,
          data: "oper_is_paid",
          render: function(data, type, row, meta) {
            if (data == 1) {
              return '<span  style="color:blue">Paid</span>';
            } else {
              return '<span  style="color:red">Unpaid</span>';
            }
          }
        }
      ]
    });

    OmtComponent.globalomtDT = omtDataTable;
    this.items = [
      {
        label: "Set as Paid",
        icon: "pi pi-fw pi-plus",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "setAsPaidBtn"
          ) as HTMLElement;
          element.click();
        }
      },
      {
        label: "Delete",
        icon: "pi pi-fw pi-times",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "deleteOperationBtn"
          ) as HTMLElement;
          element.click();
        }
      }
    ];

    omtDataTable.on("select", function(e, dt, type, indexes) {
      if (type === "row") {
        OmtComponent.selectedRowData = omtDataTable.row(indexes).data();
        var ID = omtDataTable.row(indexes).data()["oper_id"];
        OmtComponent.selectedTranID = ID;
      } else if (type === "column") {
        OmtComponent.selectedTranID = -1;
      }
    });

    $("#omtDT tbody").on("mousedown", "tr", function(event) {
      if (event.which == 3) {
        omtDataTable.row(this).select();
      }
    });
  }

  ngOnDestroy() {
    OmtComponent.globalomtDT.fixedHeader.disable();
  }

  // ----------------------- Western Union Section ------------------------------------

  openWUModal(wuModal) {
    this.modalReference = this.modalService.open(wuModal, {
      centered: true,
      backdrop: "static",
      ariaLabelledBy: "modal-basic-title"
    });

    this.wuForm = this.fb.group({
      operationType: ["wu"],
      currency: ["d", Validators.required],
      tranType: ["p", Validators.required],
      amountD: ["", [Validators.required, Validators.min(1)]],
      amountL: ["", [Validators.required, Validators.min(1)]],
      clientName: [""],
      clientID: [1]
    });

    this.wuOnAmountDChange();
    this.wuOnClientNameChange();
  }

  wuOnAmountDChange(): void {
    this.wuForm.get("amountD").valueChanges.subscribe(val => {
      var amountD = +this.wuForm.get("amountD").value;
      var amountLL = amountD * 1500;
      this.wuForm.get("amountL").setValue(amountLL);
    });
  }

  wuOnClientNameChange(): void {
    this.wuForm.get("clientName").valueChanges.subscribe(val => {
      var data = this.wuForm.get("clientName").value;
      if (data == "") {
        this.options = [];
        return;
      }
      this.omtService.searchClient(data).subscribe(Response => {
        this.options = Response;
      });
    });
  }

  wuSetClient(id) {
    this.wuForm.controls["clientName"].disable();
    this.wuForm.get("clientID").setValue(+id);
  }

  wuClearClientName() {
    this.wuForm.controls["clientName"].enable();
    this.wuForm.get("clientName").setValue("");
    this.wuForm.get("clientID").setValue(1);
  }

  addWuOperation() {
    this.omtService.addOMTOperation(this.wuForm.value).subscribe(
      Response => {
        OmtComponent.globalomtDT.ajax.reload();
        this.getTotalOperations();
        swal({
          type: "success",
          title: "Success",
          text: "Operation Added Successfully",
          showConfirmButton: false,
          timer: 1000
        });
      },
      error => {
        swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );
    this.modalReference.close();
  }

  // ----------------------- OMT Intra Section ------------------------------------

  openIntraModal(intraModal) {
    this.intraIsDollar = true;
    this.modalReference = this.modalService.open(intraModal, {
      centered: true,
      backdrop: "static",
      ariaLabelledBy: "modal-basic-title"
    });

    this.intraForm = this.fb.group({
      operationType: ["in"],
      tranType: ["p", Validators.required],
      currency: ["d", Validators.required],
      amountD: [""],
      amountL: ["", [Validators.required, Validators.min(1)]],
      clientName: [""],
      clientID: [1]
    });

    this.intraOnAmountDChange();
    this.intraOnClientNameChange();
    this.intraCurrencyChange();
  }

  intraCurrencyChange(): any {
    this.intraForm.get("currency").valueChanges.subscribe(val => {
      this.intraForm.get("amountD").setValue(0);
      this.intraForm.get("amountL").setValue(0);
      if (val == "l") this.intraIsDollar = false;
      else this.intraIsDollar = true;
    });
  }

  intraOnAmountDChange(): void {
    this.intraForm.get("amountD").valueChanges.subscribe(val => {
      var amountD = +this.intraForm.get("amountD").value;
      var amountLL = amountD * 1500;
      this.intraForm.get("amountL").setValue(amountLL);
    });
  }

  intraOnClientNameChange(): void {
    this.intraForm.get("clientName").valueChanges.subscribe(val => {
      var data = this.intraForm.get("clientName").value;
      if (data == "") {
        this.options = [];
        return;
      }
      this.omtService.searchClient(data).subscribe(Response => {
        this.options = Response;
      });
    });
  }

  intraSetClient(id) {
    this.intraForm.controls["clientName"].disable();
    this.intraForm.get("clientID").setValue(+id);
  }

  intraClearClientName() {
    this.intraForm.controls["clientName"].enable();
    this.intraForm.get("clientName").setValue("");
    this.intraForm.get("clientID").setValue(1);
  }

  addIntraOperation() {
    this.omtService.addOMTOperation(this.intraForm.value).subscribe(
      Response => {
        OmtComponent.globalomtDT.ajax.reload();
        this.getTotalOperations();
        swal({
          type: "success",
          title: "Success",
          text: "Operation Added Successfully",
          showConfirmButton: false,
          timer: 1000
        });
      },
      error => {
        swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );
    this.modalReference.close();
  }

  // ----------------------- Telecom Bill Section ------------------------------------

  openbillModal(billModal) {
    this.billIsDollar = true;
    this.modalReference = this.modalService.open(billModal, {
      centered: true,
      backdrop: "static",
      ariaLabelledBy: "modal-basic-title"
    });

    this.billForm = this.fb.group({
      operationType: ["bill"],
      tranType: ["p"],
      currency: ["d", Validators.required],
      amountD: [""],
      amountL: ["", [Validators.required, Validators.min(1)]],
      clientName: [""],
      clientID: [1]
    });

    this.billOnAmountDChange();
    this.billOnClientNameChange();
    this.billCurrencyChange();
  }

  billCurrencyChange(): any {
    this.billForm.get("currency").valueChanges.subscribe(val => {
      this.billForm.get("amountD").setValue(0);
      this.billForm.get("amountL").setValue(0);
      if (val == "l") this.billIsDollar = false;
      else this.billIsDollar = true;
    });
  }

  billOnAmountDChange(): void {
    this.billForm.get("amountD").valueChanges.subscribe(val => {
      var amountD = +this.billForm.get("amountD").value;
      var amountLL = amountD * 1500;
      this.billForm.get("amountL").setValue(amountLL);
    });
  }

  billOnClientNameChange(): void {
    this.billForm.get("clientName").valueChanges.subscribe(val => {
      var data = this.billForm.get("clientName").value;
      if (data == "") {
        this.options = [];
        return;
      }
      this.omtService.searchClient(data).subscribe(Response => {
        this.options = Response;
      });
    });
  }

  billSetClient(id) {
    this.billForm.controls["clientName"].disable();
    this.billForm.get("clientID").setValue(+id);
  }

  billClearClientName() {
    this.billForm.controls["clientName"].enable();
    this.billForm.get("clientName").setValue("");
    this.billForm.get("clientID").setValue(1);
  }

  addBillOperation() {
    this.omtService.addOMTOperation(this.billForm.value).subscribe(
      Response => {
        OmtComponent.globalomtDT.ajax.reload();
        swal({
          type: "success",
          title: "Success",
          text: "Operation Added Successfully",
          showConfirmButton: false,
          timer: 1000
        });
      },
      error => {
        swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );
    this.modalReference.close();
  }

  // ----------------------- Cash to Business Section ------------------------------------

  openctbModal(ctbModal) {
    this.ctbIsDollar = true;
    this.modalReference = this.modalService.open(ctbModal, {
      centered: true,
      backdrop: "static",
      ariaLabelledBy: "modal-basic-title"
    });

    this.ctbForm = this.fb.group({
      operationType: ["ctb"],
      currency: ["d", Validators.required],
      amountD: [""],
      tranType: ["p"],
      amountL: ["", [Validators.required, Validators.min(1)]],
      clientName: [""],
      clientID: [1]
    });

    this.ctbOnAmountDChange();
    this.ctbOnClientNameChange();
    this.ctbCurrencyChange();
  }

  ctbCurrencyChange(): any {
    this.ctbForm.get("currency").valueChanges.subscribe(val => {
      this.ctbForm.get("amountD").setValue(0);
      this.ctbForm.get("amountL").setValue(0);
      if (val == "l") this.ctbIsDollar = false;
      else this.ctbIsDollar = true;
    });
  }

  ctbOnAmountDChange(): void {
    this.ctbForm.get("amountD").valueChanges.subscribe(val => {
      var amountD = +this.ctbForm.get("amountD").value;
      var amountLL = amountD * 1500;
      this.ctbForm.get("amountL").setValue(amountLL);
    });
  }

  ctbOnClientNameChange(): void {
    this.ctbForm.get("clientName").valueChanges.subscribe(val => {
      var data = this.ctbForm.get("clientName").value;
      if (data == "") {
        this.options = [];
        return;
      }
      this.omtService.searchClient(data).subscribe(Response => {
        this.options = Response;
      });
    });
  }

  ctbSetClient(id) {
    this.ctbForm.controls["clientName"].disable();
    this.ctbForm.get("clientID").setValue(+id);
  }

  ctbClearClientName() {
    this.ctbForm.controls["clientName"].enable();
    this.ctbForm.get("clientName").setValue("");
    this.ctbForm.get("clientID").setValue(1);
  }

  addctbOperation() {
    this.omtService.addOMTOperation(this.ctbForm.value).subscribe(
      Response => {
        OmtComponent.globalomtDT.ajax.reload();
        swal({
          type: "success",
          title: "Success",
          text: "Operation Added Successfully",
          showConfirmButton: false,
          timer: 1000
        });
      },
      error => {
        swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );
    this.modalReference.close();
  }

  // --------------------------------------

  openExtraModal(extraModal) {
    this.extraIsDollar = true;
    this.modalReference = this.modalService.open(extraModal, {
      centered: true,
      backdrop: "static",
      ariaLabelledBy: "modal-basic-title"
    });

    this.extraForm = this.fb.group({
      operationType: ["ext"],
      currency: ["d", Validators.required],
      amountD: [""],
      tranType: ["p"],
      clientID: [1],
      amountL: ["", [Validators.required, Validators.min(1)]]
    });

    this.extraOnAmountDChange();
    this.extraCurrencyChange();
  }

  extraCurrencyChange(): any {
    this.extraForm.get("currency").valueChanges.subscribe(val => {
      this.extraForm.get("amountD").setValue(0);
      this.extraForm.get("amountL").setValue(0);
      if (val == "l") this.extraIsDollar = false;
      else this.extraIsDollar = true;
    });
  }

  extraOnAmountDChange(): void {
    this.extraForm.get("amountD").valueChanges.subscribe(val => {
      var amountD = +this.extraForm.get("amountD").value;
      var amountLL = amountD * 1500;
      this.extraForm.get("amountL").setValue(amountLL);
    });
  }

  addExtraOperation() {
    this.omtService.addOMTOperation(this.extraForm.value).subscribe(
      Response => {
        OmtComponent.globalomtDT.ajax.reload();
        swal({
          type: "success",
          title: "Success",
          text: "Operation Added Successfully",
          showConfirmButton: false,
          timer: 1000
        });
      },
      error => {
        swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );
    console.log(this.extraForm.value);
    this.modalReference.close();
  }

  static findWithAttr2(array, attr, attr2, value, value2) {
    var index = -1;
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value && array[i][attr2] === value2) {
        index = i;
      }
    }
    return index;
  }

  setAsPaid() {
    console.log(OmtComponent.selectedRowData)
    if(OmtComponent.selectedRowData['oper_is_paid'] == 1){
      swal({
        type: "info",
        title: 'Set Transaction as Paid',
        text: 'this transaction is already paid'
      });
      return;
    }

    var oper_id = OmtComponent.selectedRowData['oper_id'];
    var oper_amount_l = OmtComponent.selectedRowData['oper_amount_l'];
    var oper_client_id = OmtComponent.selectedRowData['oper_client_id'];


    swal({
      title: "Set Transcation as Paid",
      html: "Do you want to set this transcation as paid",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes!",
      cancelButtonText: "No"
    }).then(result => {
      if (result.value) {
        this.omtService.setTransactionAsPaid(oper_id,oper_client_id,oper_amount_l).subscribe(
          Response => {
            OmtComponent.globalomtDT.ajax.reload();
            swal({
              type: "success",
              title: "Success",
              text: "Transaction Set as Paid Successfully",
              showConfirmButton: false,
              timer: 1000
            });
          },
          error => {
            swal({
              type: "error",
              title: error.statusText,
              text: error.message
            });
          }
        );
      }
    });

    
    
   
  }

  getTotalOperations() {
    this.omtService.omtTotalToday().subscribe(
      Response => {
        this.totalWesternUnionMinus = 0;
        this.totalWesternUnionPlus = 0;
        this.totalIntraPlus = 0;
        this.totalIntraMinus = 0;
        this.totalsArray = Response;
        console.log(this.totalsArray);

        var index1 = OmtComponent.findWithAttr2(this.totalsArray,"oper_tran_type","oper_type","m","in");
        var index2 = OmtComponent.findWithAttr2(this.totalsArray,"oper_tran_type","oper_type","p","in");
        var index3 = OmtComponent.findWithAttr2(this.totalsArray,"oper_tran_type","oper_type","m","wu");
        var index4 = OmtComponent.findWithAttr2(this.totalsArray,"oper_tran_type","oper_type","p","wu");

        if (index1 != -1) {
          this.totalIntraMinus = this.totalsArray[index1]["total"];
        }
        if (index2 != -1) {
          this.totalIntraPlus = this.totalsArray[index2]["total"];
        }
        if (index3 != -1) {
          this.totalWesternUnionMinus = this.totalsArray[index3]["total"];
        }
        if (index4 != -1) {
          this.totalWesternUnionPlus = this.totalsArray[index4]["total"];
        }
      },
      error => {
        swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );
  }

  deleteOperation() {
    swal({
      title: "Delete Transcation",
      html: "Do you want to delete this transcation",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes!",
      cancelButtonText: "No"
    }).then(result => {
      if (result.value) {
        this.omtService.deleteOperation(OmtComponent.selectedRowData).subscribe(
          Response => {
            OmtComponent.globalomtDT.ajax.reload(null, false);
            this.getTotalOperations();
            swal({
              type: "success",
              title: "Success",
              text: "Invoice Deleted Successfully",
              showConfirmButton: false,
              timer: 1000
            });
          },
          error => {
            swal({
              type: "error",
              title: error.statusText,
              text: error.message
            });
          }
        );
      }
    });
  }
}
