import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import { MenuItem } from "primeng/api";
import { MobileDrawerService } from "./mobile-drawer.service";
declare var $: any;
import swal from "sweetalert2";
import { DrawerService } from "../drawer/drawer.service";

@Component({
  selector: "app-mobile-drawer",
  templateUrl: "./mobile-drawer.component.html",
  styleUrls: ["./mobile-drawer.component.css"]
})
export class MobileDrawerComponent implements OnInit {
  private mobileDrawer;
  modalReference: any;
  private clientForm;
  private paymentForm;
  paymentModalTitle;
  showDetailsDay;
  clientModalTitle;
  editFlag = false;
  subscriberModalTitle;
  private static selectedRowData;
  private static selectedDay;
  editedClientData = {};
  items: MenuItem[];
  private globalMobileDrawerDT;
  private detailsDay;
  operationModalTitle;
  private operationForm;
  transferForm;

  constructor(
    private drawerService: DrawerService,
    private mobileDrawerService: MobileDrawerService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.getMobileDrawer();

    var mobileDrawerDT = $("#mobileDrawerDT").DataTable({
      responsive: true,
      paging: true,
      pagingType: "full_numbers",
      serverSide: false,
      processing: true,
      select: {
        style: "single"
      },
      ordering: true,
      stateSave: false,
      fixedHeader: false,
      searching: true,
      lengthMenu: [[30], [30]],
      data: this.mobileDrawer,
      order: [[0, "desc"]],
      columns: [
        { data: "date", title: "Drawer Date" },
        {
          data: "total",
          title: "Drawer Total",
          render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
        },
        {
          data: "amount",
          title: "Intial Amount",
          render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
        },
        {
          data: "sumPrice",
          title: "Payments In",
          render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
        },
        {
          data: "sumProfit",
          title: "Profit In",
          render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
        },
        {
          data: "supplySum",
          title: "Supply",
          render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
        },
        {
          data: "sumWithdraw",
          title: "Withdraw",
          render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
        },
        {
          data: "sumAdded",
          title: "Add",
          render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
        }
      ]
    });
    this.globalMobileDrawerDT = mobileDrawerDT;
    this.items = [
      {
        label: "Show Details",
        icon: "pi pi-fw pi-bars",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "showDetailsBtn"
          ) as HTMLElement;
          element.click();
        }
      }
    ];
    mobileDrawerDT.on("select", function(e, dt, type, indexes) {
      if (type === "row") {
        MobileDrawerComponent.selectedRowData = mobileDrawerDT
          .row(indexes)
          .data();
        var data = mobileDrawerDT.row(indexes).data()["date"];
        MobileDrawerComponent.selectedDay = data;
      } else if (type === "column") {
        MobileDrawerComponent.selectedDay = -1;
      }
    });
    $("#mobileDrawerDT tbody").on("mousedown", "tr", function(event) {
      if (event.which == 3) {
        mobileDrawerDT.row(this).select();
      }
    });
    $("#mobileDrawerDT").on("key-focus.dt", function(e, datatable, cell) {
      $(mobileDrawerDT.row(cell.index().row).node()).addClass("selected");
    });
    $("#mobileDrawerDT").on("key-blur.dt", function(e, datatable, cell) {
      $(mobileDrawerDT.row(cell.index().row).node()).removeClass("selected");
    });
  }

  getMobileDrawer() {
    this.mobileDrawerService.getMobileDrawer().subscribe(
      Response => {
        this.mobileDrawer = Response;
        $("#mobileDrawerDT")
          .dataTable()
          .fnAddData(this.mobileDrawer);
      },
      error => {
        console.log(error);
      }
    );
  }

  openOperationModal(openModal, type) {
    this.modalReference = this.modalService.open(openModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });
    if (type == "a") this.operationModalTitle = "ADD";
    else if (type == "w") this.operationModalTitle = "WITHDRAW";
    this.operationForm = this.fb.group({
      op_type: [type],
      drawer: ["m"],
      amount: [0, Validators.min(1)],
      comment: [""]
    });
  }

  addNewOperation() {
    this.drawerService.newOperation(this.operationForm.value).subscribe(
      Response => {
        var table = $("#mobileDrawerDT").DataTable();

        table.clear().draw();

        this.getMobileDrawer();
        swal({
          type: "success",
          title: "Success",
          text: "Operation Successfully",
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

  openShowDetails(showDetails) {
    this.mobileDrawerService.getMobileDetailsDay(MobileDrawerComponent.selectedDay).subscribe(Response => {
          this.detailsDay = Response;
          var detailDayDT = $("#detailDay").DataTable({
            responsive: true,
            paging: true,
            pagingType: "full_numbers",
            serverSide: false,
            processing: true,
            select: {
              style: "single"
            },
            ordering: true,
            stateSave: false,
            fixedHeader: false,
            searching: true,
            lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
            data: this.detailsDay,
            order: [[0, "desc"]],
            columns: [
              { data: "dayTime", title: "Time" },
              {
                data: "amount",
                title: "Amount",
                render: $.fn.dataTable.render.number(",", ".", 0, "LL ")
              },
              { data: "type", title: "Type" },
              { data: "note", title: "Note" }
            ],
            columnDefs: [
              {
                targets: 2,
                data: "type",
                render: function(data, type, row, meta) {
                  if (data == null) {
                    return "Payment";
                  } else if (data == "a") {
                    return "Add";
                  } else if (data == "w") {
                    return "Withdraw";
                  }
                }
              }
            ]
          });
          $("#detailDay tbody").on("mousedown", "tr", function(event) {
            if (event.which == 3) {
              detailDayDT.row(this).select();
            }
          });

          $("#detailDay").on("key-focus.dt", function(e, datatable, cell) {
            $(detailDayDT.row(cell.index().row).node()).addClass("selected");
          });
          $("#detailDay").on("key-blur.dt", function(e, datatable, cell) {
            $(detailDayDT.row(cell.index().row).node()).removeClass("selected");
          });
        },
        error => {
          alert(error);
        }
      );
    this.modalReference = this.modalService.open(showDetails, {
      centered: true,
      ariaLabelledBy: "modal-basic-title",
      size: "lg"
    });
    this.showDetailsDay = "Show Details " + MobileDrawerComponent.selectedDay;
  }

  openTransferModal(transferModal) {
    this.modalReference = this.modalService.open(transferModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });

    this.transferForm = this.fb.group({
      toDrawer: ["", Validators.required],
      fromDrawer: ["", Validators.required],
      amount: [0, Validators.min(1)],
      comment: [""]
    });
  }

  submitransfer() {
    if (
      this.transferForm.get("toDrawer").value ==
      this.transferForm.get("fromDrawer").value
    ) {
      swal({
        type: "error",
        title: "Error",
        text: "from and to drawer must be different"
      });
      return;
    }

    this.drawerService.newTransferOperation(this.transferForm.value).subscribe(
      Response => {
        var table = $("#mobileDrawerDT").DataTable();

        table.clear().draw();

        this.getMobileDrawer();
        swal({
          type: "success",
          title: "Success",
          text: "Transform Compeleted Successfully",
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
}
