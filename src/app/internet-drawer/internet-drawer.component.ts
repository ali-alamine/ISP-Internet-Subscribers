import { Component, OnInit } from "@angular/core";
import { InternetDrawerService } from "./internet-drawer.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import { MenuItem } from "primeng/api";
import { ActivatedRoute } from "../../../node_modules/@angular/router";
import { DrawerService } from "../drawer/drawer.service";
import swal from "sweetalert2";
declare var $: any;
@Component({
  selector: "app-internet-drawer",
  templateUrl: "./internet-drawer.component.html",
  styleUrls: ["./internet-drawer.component.css"]
})
export class InternetDrawerComponent implements OnInit {
  private internetDrawer;

  modalReference: any;
  private clientForm;
  private paymentForm;
  paymentModalTitle;
  showDetailsDay;
  editFlag = false;
  subscriberModalTitle;
  private static selectedRowData;
  private static selectedDay;
  editedClientData = {};
  items: MenuItem[];
  private globalInternetDrawerDT;
  private detailsDay;
  operationModalTitle;
  public selectedVal: string;
  private operationForm;
  transferForm;

  constructor(
    private drawerService: DrawerService,
    private internetDrawerService: InternetDrawerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getInternetDrawerDT();
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
  }
  getInternetDrawerDT() {
    this.internetDrawerService.getInternetDrawer().subscribe(
      Response => {
        this.internetDrawer = Response;
        $("#internetDrawerDT")
          .dataTable()
          .fnAddData(this.internetDrawer);
      },
      error => {
        console.log(error);
      }
    );
    var internetDrawerDT = $("#internetDrawerDT").DataTable({
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
      data: this.internetDrawer,
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
          data: "sumProfile",
          title: "Payments In",
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
    this.globalInternetDrawerDT = internetDrawerDT;
    internetDrawerDT.on("select", function(e, dt, type, indexes) {
      if (type === "row") {
        InternetDrawerComponent.selectedRowData = internetDrawerDT
          .row(indexes)
          .data();
        var data = internetDrawerDT.row(indexes).data()["date"];
        InternetDrawerComponent.selectedDay = data;
      } else if (type === "column") {
        InternetDrawerComponent.selectedDay = -1;
      }
    });
    $("#internetDrawerDT tbody").on("mousedown", "tr", function(event) {
      if (event.which == 3) {
        internetDrawerDT.row(this).select();
      }
    });
    $("#internetDrawerDT").on("key-focus.dt", function(e, datatable, cell) {
      $(internetDrawerDT.row(cell.index().row).node()).addClass("selected");
    });
    $("#internetDrawerDT").on("key-blur.dt", function(e, datatable, cell) {
      $(internetDrawerDT.row(cell.index().row).node()).removeClass("selected");
    });
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
      drawer: ["s"],
      amount: [0, Validators.min(1)],
      comment: [""]
    });
  }

  addNewOperation() {
    this.drawerService.newOperation(this.operationForm.value).subscribe(
      Response => {
        this.internetDrawer = "";
        $("#internetDrawerDT")
          .DataTable()
          .destroy();
        $("#internetDrawerDT").empty();
        this.getInternetDrawerDT();
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
    this.internetDrawerService
      .getInternetDetailsDay(InternetDrawerComponent.selectedDay)
      .subscribe(
        Response => {
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
    this.showDetailsDay = "Show Details " + InternetDrawerComponent.selectedDay;
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
        this.internetDrawer = "";
        $("#internetDrawerDT")
          .DataTable()
          .destroy();
        $("#internetDrawerDT").empty();
        this.getInternetDrawerDT();
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
