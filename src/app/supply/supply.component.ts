import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SupplyService } from './supply.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../stock/stock.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.css']
})
export class SupplyComponent implements OnInit {
  modalReference: any;
  supplyForm: FormGroup;
  options;
  items:any;
  newItemForm: FormGroup;
  rechargeCardForm: FormGroup;
  type="RC";
  openModal="newRechargeCardModal";
  constructor(private fb: FormBuilder, 
    private supplyService: SupplyService, 
    private modalService: NgbModal, 
    private stockService: StockService) { }

  ngOnInit() {
    this.supplyForm = this.fb.group({
      supplyDate: ['', Validators.required],
      type: 'AC',
      supplierName: ['', Validators.required],
      searchSupplier: '',
      supplierID: '',
      totalPrice:[0,[Validators.required, Validators.min(1)]],
      paid: [0,[Validators.required, Validators.min(0)]],
      items: this.fb.array([]),
      drawer:['out',Validators.required]
    });
    this.onSupplierNameChange();
    this.addRow();
    this.onTypeChange();
    this.onTotalPriceChange();
  }
  onTypeChange(): void {
    this.supplyForm.get('type').valueChanges.subscribe(val => {
      this.type = this.supplyForm.get('type').value;
      this.supplyForm.get('totalPrice').setValue(0); 
      var length=this.itemsForm.length;
      for(var i=length-1;i>=0;i--){
        this.deleteItem(i,false);
      }
      this.items = [];
      if(this.type=="RC"){
        this.supplyForm.get('drawer').setValue('M');
        this.openModal="newRechargeCardModal";
      }
      if(this.type=="AC"){
        this.supplyForm.get('drawer').setValue('A');
        this.openModal="newAccessoriesModal";
      }
      this.addRow();
    });
  }
  onItemNameChange(index){
      var data = this.itemsForm.controls[index].get('searchItem').value;
      if (data == "") {
        this.items = [];
        return;
      }
      this.supplyService.searchItem(data,this.type).subscribe(Response => {
        this.items = Response;
      })
  }
  rowChangePrice(index){
    var total=0;
    for (var i = 0; i < this.itemsForm.controls.length; i++) {
      var price = this.itemsForm.controls[i].get('price').value;
      var itemTotalPrice=(this.itemsForm.controls[i].get('price').value)*(this.itemsForm.controls[i].get('quantity').value);
      this.itemsForm.controls[i].get('itemTotalPrice').setValue(itemTotalPrice);
      total = total + itemTotalPrice;
    }
    this.supplyForm.get('totalPrice').setValue(total);
    this.supplyForm.get('paid').setValue(total);
  }
  onTotalPriceChange(): void{
    this.supplyForm.get('totalPrice').valueChanges.subscribe(val => {
      var total = this.supplyForm.get('totalPrice').value;
      this.supplyForm.get('paid').setValue(total);
    });
  }
  onSupplierNameChange(): void {
    this.supplyForm.get('searchSupplier').valueChanges.subscribe(val => {
      var data = this.supplyForm.get('searchSupplier').value;
      if (data == "") {
        this.options = [];
        return;
      }
      this.supplyService.searchSupplier(data).subscribe(Response => {
        this.options = Response;
      })
    });
  }
  addRow() {
    const item = this.fb.group({
      searchItem: [],
      itemID: ['',Validators.required],
      price: [0,Validators.min(1)],
      quantity: [0,Validators.min(1)],
      itemTotalPrice: [0,Validators.min(1)]
    });
    this.itemsForm.push(item);
  }
  addItem(i,id,name) {
    this.itemsForm.controls[i].get('searchItem').setValue(name);
    this.itemsForm.controls[i].get('searchItem').disable();
    this.itemsForm.controls[i].get('itemID').setValue(id);
    this.items = [];
  }
  deleteItem(i,editPrice) {
    this.itemsForm.removeAt(i);
    if(editPrice==true){
      this.rowChangePrice(i);
    }
  }
  test(id, name) {
    this.supplyForm.get('searchSupplier').setValue('');
    this.supplyForm.get('supplierName').setValue(name);
    this.supplyForm.get('supplierID').setValue(id);
  }
  openNewItemModal(newAccessoriesModal,newRechargeCardModal){
    if(this.openModal=="newRechargeCardModal"){
      this.modalReference = this.modalService.open(newRechargeCardModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
      this.rechargeCardForm = this.fb.group({
        name: ['', Validators.required],
        company: ['', Validators.required],
        price: ['', Validators.required],
        bar_code: ''
      });
    }
    if(this.openModal=="newAccessoriesModal"){
      this.modalReference = this.modalService.open(newAccessoriesModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
      this.newItemForm = this.fb.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
        bar_code: ['']
      });

    }

  }
  addNewAccessories() {
    this.stockService.addNewAcc(this.newItemForm.value).subscribe(Response => {
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
    this.modalReference.close();
  }
  addNewRechargeCard() {
    this.stockService.addNewMRC(this.rechargeCardForm.value).subscribe(Response => {
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
    this.modalReference.close();
  }
  addSupplyInvoice() {
    this.supplyService.addSupply(this.supplyForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text:'Supply Successfully',
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
    this.supplyForm.reset();
      this.supplyForm.get('totalPrice').setValue(0); 
      this.supplyForm.get('type').setValue('RC'); 
      this.supplyForm.get('drawer').setValue('M');  
      this.supplyForm.get('paid').setValue(0); 
  }
  tabKey(data){
    if(data==this.itemsForm.length-1)
      this.addRow();
  }
  get itemsForm() {
    return this.supplyForm.get('items') as FormArray
  }
  get itemPrice() {
    return this.itemsForm.controls[0].get('itemPrice');
  }
  get tt() {
    return this.supplyForm.get('totalPrice');
  }

}
