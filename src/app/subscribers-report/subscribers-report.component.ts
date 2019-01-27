import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-subscribers-report',
  templateUrl: './subscribers-report.component.html',
  styleUrls: ['./subscribers-report.component.css']
})
export class SubscribersReportComponent implements OnInit {
  panelOpenState = false;
  filterForm;
  private static globalDataTable;
  private static paidFlag=-1;
  private static clientStatusFlag=-1;
  private static profileSearch=-1;
  private static addressSearch='';

  private static fromExpDate;
  private static toExpDate;



  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    var subscriberDataTable = $('#subscribersRprtDT').DataTable({
      responsive: false,
      dom: 'Bfrtip',
      buttons: [
        {
            extend: 'print',
            messageTop: 'Subscribers Report',
            text: 'Print all',
            exportOptions: {
                columns: ':visible',
                modifier: {
                  selected: null
              }
            }
        },
        'colvis',
        {
          extend: 'print',
          text: 'Print selected'
      },
      'pageLength'
    ],
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      searching: false,
      stateSave: false,
      fixedHeader: true,
      select: {
        "style": "multi"
      },
      lengthMenu: [[ 25, 50, 100, 200, 400,800,1600], [25, 50, 100, 200, 400,800,1600]],
      ajax: {
        type: "get",
        url: "http://localhost/e-safe-data/src/assets/api/dataTables/subRprtDataTable.php",
        data: function ( d ) {
          return $.extend( {}, d, {
            "paid": SubscribersReportComponent.paidFlag,
            "profile":SubscribersReportComponent.profileSearch,
            "address":SubscribersReportComponent.addressSearch,
            "isActivated":SubscribersReportComponent.clientStatusFlag,
            "fromExpDate":SubscribersReportComponent.fromExpDate,
            "toExpDate":SubscribersReportComponent.toExpDate
          } );
        },
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "ID", title: "ID" },
        { data: "name", title: "Name" },
        { data: "username", title: "username" },
        { data: "profile", title: "Amount", render:$.fn.dataTable.render.number( ',', '.', 0, 'LL ' ) },
        { data: "phone", title: "Phone" },
        { data: "address", title: "Address" },
        { data: "subDate", title: "Sub Date" },
        { data: "expDate", title: "Exp Date" },
        { data: "isPaid", title: "Paid/Unpaid" },
        { data: "is_activated", title: "Activated" }
      ],
      "columnDefs": [
        {
          "targets": 8,
          "data": "isPaid",
          "render": function (data, type, row, meta) {
            if (data == 1) {
              return '<p  style="color:blue">Paid</a>';
            }
            else if (data == 0) {
              return '<p  style="color:red">Unpaid</a>';
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
              return '<p  style="color:red">Deactivated</a>';

            }
            else {
              return '<p  style="color:blue">Activated</a>';
            }

          }
        }
      ]
    });
    SubscribersReportComponent.globalDataTable=subscriberDataTable;
    this.filterForm = this.fb.group({
      paid: ['-1'],
      isActivated: ['-1'],
      address: [''],
      profile: ['-1'],
      fromExpDate:[],
      toExpDate:[],
    });
  }

  clearForm(){
    // this.filterForm.reset();
  }

  searchSubmit(){
    console.log(this.filterForm.value)
// prevent of using default date
    if(this.filterForm.get('fromExpDate').value != null && this.filterForm.get('toExpDate').value != null){
      SubscribersReportComponent.fromExpDate=formatDate(this.filterForm.get('fromExpDate').value,'yyyy-MM-dd','en');
      SubscribersReportComponent.toExpDate=formatDate(this.filterForm.get('toExpDate').value,'yyyy-MM-dd','en');
    }
    else if(this.filterForm.get('fromExpDate').value != null || this.filterForm.get('toExpDate').value != null){
      if(this.filterForm.get('fromExpDate').value != null){
        SubscribersReportComponent.fromExpDate=formatDate(this.filterForm.get('fromExpDate').value,'yyyy-MM-dd','en');
        SubscribersReportComponent.toExpDate=formatDate(this.filterForm.get('fromExpDate').value,'yyyy-MM-dd','en');
      }
      else{
        SubscribersReportComponent.fromExpDate=formatDate(this.filterForm.get('toExpDate').value,'yyyy-MM-dd','en');
        SubscribersReportComponent.toExpDate=formatDate(this.filterForm.get('toExpDate').value,'yyyy-MM-dd','en');
      }
      
    }
    else{
      SubscribersReportComponent.fromExpDate="";
      SubscribersReportComponent.toExpDate="";
    }
    SubscribersReportComponent.paidFlag=this.filterForm.get('paid').value;
    SubscribersReportComponent.clientStatusFlag=this.filterForm.get('isActivated').value;
    SubscribersReportComponent.addressSearch=this.filterForm.get('address').value;
    SubscribersReportComponent.profileSearch=this.filterForm.get('profile').value;
    SubscribersReportComponent.globalDataTable.ajax.reload();
  }

}

