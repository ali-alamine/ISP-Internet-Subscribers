import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-internet-invoices',
  templateUrl: './internet-invoices.component.html',
  styleUrls: ['./internet-invoices.component.css']
})
export class InternetInvoicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var internetInvoicesDT = $('#internetInvoicesDT').DataTable({
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
      lengthMenu: [[ 25, 50, 100, 200, 400,800], [ 25, 50, 100, 200, 400,800]],
      ajax: {
        type: "get",
        url: "http://localhost/e-safe-data/src/assets/api/dataTables/internetInvoicesDT.php",
        data: { "userID": 12, "isAdmin": 2 },
        cache: true,
        async: true
      },
      order: [[2, 'desc']],
      columns: [
        
        { data: "name", title: "Name" },
        { data: "profile", title: "Amount" },
        { data: "paymentDate", title: "Payment Date" },
        { data: "subDate", title: "Sub Date" },
        { data: "expDate", title: "Exp Date" }
      ]
    });
  }

}
