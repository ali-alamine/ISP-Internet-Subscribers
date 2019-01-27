import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DrawerService } from "../drawer/drawer.service";
declare var $: any;
@Component({
  selector: "app-drawer-omt",
  templateUrl: "./drawer-omt.component.html",
  styleUrls: ["./drawer-omt.component.css"]
})
export class DrawerOmtComponent implements OnInit {
  modalReference: any;
  operationModalTitle: string;

  operationForm;
  transferForm: any;
  omtDrawerValues: any;
  static selectedRowData: any;
  static selectedDay: any;
  globalOmtDrawer: any;
  items: { label: string; icon: string; command: (event: any) => void; }[];
  detailsDay: any;
  showDetailsDay: string;
  constructor(
    private drawerService: DrawerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getOmtDrawerDT();
    this.items = [
      {
        label: "Show Details",
        icon: "pi pi-fw pi-bars",
        command: event => {
          let element: HTMLElement = document.getElementById("showDetailsBtn") as HTMLElement;
          element.click();
        }
      }
    ];
  }

  openOperationModal(openModal, type) {
    this.modalReference = this.modalService.open(openModal, {
      centered: true,
      backdrop: 'static',
      ariaLabelledBy: "modal-basic-title"
    });
    if (type == "a") this.operationModalTitle = "Add";
    else if (type == "w") this.operationModalTitle = "Withdraw";

    this.operationForm = this.fb.group({
      op_type: [type],
      drawer: ["O"],
      amount: [0, Validators.min(1)],
      comment: [""]
    });
  }

  addNewOperation() {
    this.drawerService.newOperation(this.operationForm.value).subscribe(
      Response => {
        this.omtDrawerValues = "";
        $("#omtDrawerDT").DataTable().destroy();
        $("#omtDrawerDT").empty();
        this.getOmtDrawerDT();
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

  openTransferModal(transferModal) {
    this.modalReference = this.modalService.open(transferModal, {
      backdrop: 'static',
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
    if (this.transferForm.get("toDrawer").value == this.transferForm.get("fromDrawer").value) 
    {
      swal({
        type: "error",
        title: "Error",
        text: "from and to drawer must be different"
      });
      return;
    }

    this.drawerService.newTransferOperation(this.transferForm.value).subscribe(
      Response => {
        this.omtDrawerValues = "";
        $("#omtDrawerDT").DataTable().destroy();
        $("#omtDrawerDT").empty();
        this.getOmtDrawerDT();
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

  getOmtDrawerDT() {
    this.drawerService.getOmtDrawer().subscribe(Response => {
      this.omtDrawerValues = Response;
        $("#omtDrawerDT").dataTable().fnAddData(this.omtDrawerValues);
      },
      error => {
        swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );
    var omtDrawerDT = $("#omtDrawerDT").DataTable({
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
      data: this.omtDrawerValues,
      order: [[0, "desc"]],
      columns: [
        { data: "date", title: "Drawer Date" },
        {data: "total",title: "Drawer Total",render: $.fn.dataTable.render.number(",", ".", 0, "LL ")},
        {data: "amount",title: "Intial Amount",render: $.fn.dataTable.render.number(",", ".", 0, "LL ")},
        {data: "sumPlus",title: "Total Plus",render: $.fn.dataTable.render.number(",", ".", 0, "LL ")},
        {data: "sumMinus",title: "Total Minus",render: $.fn.dataTable.render.number(",", ".", 0, "LL ")},
        {data: "sumWithdraw",title: "Withdraw",render: $.fn.dataTable.render.number(",", ".", 0, "LL ")},
        {data: "sumAdded",title: "Add",render: $.fn.dataTable.render.number(",", ".", 0, "LL ")}
      ]
    });
    this.globalOmtDrawer = omtDrawerDT;
    omtDrawerDT.on("select", function(e, dt, type, indexes) {
      if (type === "row") {
        DrawerOmtComponent.selectedRowData = omtDrawerDT
          .row(indexes)
          .data();
        var data = omtDrawerDT.row(indexes).data()["date"];
        DrawerOmtComponent.selectedDay = data;
      } else if (type === "column") {
        DrawerOmtComponent.selectedDay = -1;
      }
    });
    $("#omtDrawerDT tbody").on("mousedown", "tr", function(event) {
      if (event.which == 3) {
        omtDrawerDT.row(this).select();
      }
    });
    $("#omtDrawerDT").on("key-focus.dt", function(e, datatable, cell) {
      $(omtDrawerDT.row(cell.index().row).node()).addClass("selected");
    });
    $("#omtDrawerDT").on("key-blur.dt", function(e, datatable, cell) {
      $(omtDrawerDT.row(cell.index().row).node()).removeClass("selected");
    });
  }

  openShowDetails(showDetails) {
    this.drawerService.getOmtDrawerDetails(DrawerOmtComponent.selectedDay).subscribe(
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
          swal({
            type: "error",
            title: error.statusText,
            text: error.message
          });
        }
      );
    this.modalReference = this.modalService.open(showDetails, {
      centered: true,
      backdrop: 'static',
      ariaLabelledBy: "modal-basic-title",
      size: "lg"
    });
    this.showDetailsDay = "Show Details " + DrawerOmtComponent.selectedDay;
  }
}
