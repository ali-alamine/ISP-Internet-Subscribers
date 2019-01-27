import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SubscriptionService } from './subscription.service';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

@Component({
  selector: 'app-subscribers-report',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  private sub;
  items: MenuItem[];
  private globalSubscriberReportDT;
  private static selectedRowData;
  private static selectedSubscriberID;
  private searchName;
  public full_name;
  constructor(private subscriberReportService: SubscriptionService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.searchName = params['searchName'] || '-1';
    });

    var subscriberDataTable = $('#subscribersRprtDT').DataTable({
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
      lengthMenu: [[25, 50, 100, 200, 400, 800], [25, 50, 100, 200, 400, 800]],
      ajax: {
        type: "get",
        url: "http://localhost/e-safe-data/src/assets/api/dataTables/subscriptionDT.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "ID", title: "ID" },
        { data: "name", title: "Name" },
        { data: "username", title: "username" },
        { data: "profile", title: "Amount",render:$.fn.dataTable.render.number( ',', '.', 0, 'LL ' ) },
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
              return '<span  style="color:blue">Paid</span>';
            }
            else if (data == 0) {
              return '<span  style="color:red">Unpaid</span>';
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
              return '<span  style="color:red">Deactivated</span>';

            }
            else {
              return '<span  style="color:blue">Activated</span>';
            }

          }
        }

      ]
    });

    if (this.searchName != '-1') {
      subscriberDataTable.search(this.searchName).draw();
    }

    this.items = [
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('deleteSubscriberBtn') as HTMLElement;
          element.click();
        }

      },
      {
        label: 'Toggle Payment',
        icon: 'pi pi-fw pi-ban',
        command: (event) => {
          let element: HTMLElement = document.getElementById('togglePaymentBtn') as HTMLElement;
          element.click();
        }

      },
      {
        label: 'Pirnt',
        icon: 'pi pi-fw pi-ban',
        command: (event) => {
          let element: HTMLElement = document.getElementById('printBtn') as HTMLElement;
          element.click();
        }

      }
    ];

    this.globalSubscriberReportDT = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        SubscriptionComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        var data = subscriberDataTable.row(indexes).data()['ID'];
        SubscriptionComponent.selectedSubscriberID = data;
      }
      else if (type === 'column') {
        SubscriptionComponent.selectedSubscriberID = -1;
      }
    });

    $('#subscribersRprtDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $('#subscribersRprtDT').on('key-focus.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#subscribersRprtDT').on('key-blur.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
    });
  }

  togglePayment() {
    debugger
    var title = "Change Payment's State";
    var text = "Do you want to set this payment as <b> unpaid </b> ?"
    if(SubscriptionComponent.selectedRowData['isPaid']==0){
      text = "Do you want to set this payment as <b>paid</b> ?"
    }

    Swal({
      title: title,
      html: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',     
    }).then((result) => {
      if (result.value) {
        


      
        if(SubscriptionComponent.selectedRowData['isPaid']==1){

          var pass=prompt("you need a password");
          this.subscriberReportService.checkPass(pass).subscribe(Response => {
          this.subscriberReportService.togglePayment(SubscriptionComponent.selectedRowData['subDetID'], SubscriptionComponent.selectedRowData['isPaid'],SubscriptionComponent.selectedRowData['profile'],SubscriptionComponent.selectedRowData['ID']).subscribe(Response => {
            this.globalSubscriberReportDT.ajax.reload(null, false);
            Swal({
                title: "Print Invoice",
                html: "Print this Payment",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No',
            }).then((result) => {
              if(result.value){
                // this.printFactureClient();
              }
            })
          }, error => {
            Swal({
              type: 'error',
              title: error.statusText,
              text:error.message
            });
          });

        }, error => {
          Swal("incorrect password");
        });

        }else{
          this.subscriberReportService.togglePayment(SubscriptionComponent.selectedRowData['subDetID'], SubscriptionComponent.selectedRowData['isPaid'],SubscriptionComponent.selectedRowData['profile'],SubscriptionComponent.selectedRowData['ID']).subscribe(Response => {
            this.globalSubscriberReportDT.ajax.reload(null, false);
            Swal({
                title: "Print Invoice",
                html: "Print this Payment",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No',
            }).then((result) => {
              if(result.value){
                // this.printFactureClient();
              }
            })
          }, error => {
            Swal({
              type: 'error',
              title: error.statusText,
              text:error.message
            });
          });
        }
      }

    });
  }
  print(){
    this.full_name=SubscriptionComponent.selectedRowData['name'];
    // alert(this.full_name)
    this.printFactureClient();
  }
  deleteSubscription() {

    Swal({
      title: 'Delete Subscription',
      text: 'Do you want to delete this subscription ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',     
    }).then((result) => {
      if (result.value) {
        this.subscriberReportService.deleteSubscription(SubscriptionComponent.selectedRowData['subDetID']).subscribe(Response => {
          this.globalSubscriberReportDT.ajax.reload(null, false);
          Swal({
            type: 'success',
            title: 'Success',
            text:'Subscription Deleted Successfully',
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
    });



   
  }
  printFactureClient(){
    var printContents = document.getElementById('printFacture').innerHTML;
    var popupWin = window.open('', '_blank', 'width=800,height=600');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../styles.css"></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
    setTimeout(function(){ popupWin.close(); swal("success") }, 1000);
    // this.p_clientName = '';
}
}
