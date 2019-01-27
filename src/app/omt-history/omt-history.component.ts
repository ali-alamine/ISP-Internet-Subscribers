import { Component, OnInit } from '@angular/core';
import swal from "sweetalert2";
import { FormBuilder } from '@angular/forms';
import { OmtService } from '../omt/omt.service';
import { formatDate } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-omt-history',
  templateUrl: './omt-history.component.html',
  styleUrls: ['./omt-history.component.css']
})
export class OmtHistoryComponent implements OnInit {
  static gobalOmtHistoryDT: any;
  static selectedTranID: any;
  static selectedRowData: any;
  items: { label: string; icon: string; command: (event: any) => void; }[];
  searchForm: any;
  static searchDate: any;
  static paidFlag = 0;

  constructor(private fb: FormBuilder, private omtService: OmtService) { }

  ngOnInit() {
    var omtDataTable = $("#omtHistoryDT").DataTable({
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
          "http://localhost/e-safe-data/src/assets/api/dataTables/omtHistoryDT.php",
          data: function ( d ) {
            return $.extend( {}, d, {
              "date": OmtHistoryComponent.searchDate,
              "paidFlag":OmtHistoryComponent.paidFlag
            } );
          },
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

    OmtHistoryComponent.gobalOmtHistoryDT = omtDataTable;
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
      }
    ];

    omtDataTable.on("select", function(e, dt, type, indexes) {
      if (type === "row") {
        OmtHistoryComponent.selectedRowData = omtDataTable.row(indexes).data();
        var ID = omtDataTable.row(indexes).data()["oper_id"];
        OmtHistoryComponent.selectedTranID = ID;
      } else if (type === "column") {
        OmtHistoryComponent.selectedTranID = -1;
      }
    });

    $("#omtHistoryDT tbody").on("mousedown", "tr", function(event) {
      if (event.which == 3) {
        omtDataTable.row(this).select();
      }
    });

    this.searchForm = this.fb.group({
      operDate:[new Date()]
    });
  }

  ngOnDestroy() {
    OmtHistoryComponent.gobalOmtHistoryDT.fixedHeader.disable();
  }

  searchByDate(){
    OmtHistoryComponent.paidFlag=0;
    OmtHistoryComponent.searchDate=formatDate(this.searchForm.get('operDate').value,'yyyy-MM-dd','en');
    OmtHistoryComponent.gobalOmtHistoryDT.ajax.reload();
  }

  showUnpaidOper(){
    OmtHistoryComponent.searchDate="";
    OmtHistoryComponent.paidFlag=1;
    OmtHistoryComponent.gobalOmtHistoryDT.ajax.reload();
  }

  setAsPaid() {
    console.log(OmtHistoryComponent.selectedRowData)
    if(OmtHistoryComponent.selectedRowData['oper_is_paid'] == 1){
      swal({
        type: "info",
        title: 'Set Transaction as Paid',
        text: 'this transaction is already paid'
      });
      return;
    }

    var oper_id = OmtHistoryComponent.selectedRowData['oper_id'];
    var oper_amount_l = OmtHistoryComponent.selectedRowData['oper_amount_l'];
    var oper_client_id = OmtHistoryComponent.selectedRowData['oper_client_id'];


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
            OmtHistoryComponent.gobalOmtHistoryDT.ajax.reload();
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
  

}
