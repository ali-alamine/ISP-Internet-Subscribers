import { Component, OnInit, Input } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { SellService } from './sell.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientsService } from '../clients/clients.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  show = false;
  panelOpenState = false;
  itemForSell$: any;
  items: any;
  clients: any;
  rechargeCard: any;
  offers: any;
  credits: any;
  showCredits: any;
  accessories: any;
  private sub;
  public fullCardForm;
  public offersForm;
  public creditTransfersForm;
  public centralForm;

  accessoriesForm: FormGroup;
  options;
  newItemForm: FormGroup;
  public clientDebitForm;
  public clientForm;
  modalReference: any;
  filteredCountrys= [];
  countrys = [];

  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private sellService: SellService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private router: Router,
    private clientsService: ClientsService) { }
  ngOnInit() {

    this.getRechargeCard();
    this.getOffers();
    this.getCreditsTransfers();

    this.fullCardForm = this.fb.group({
      debit: false,
      clientID: '',
      itemID: '',
      searchBarCode: '',
      cardName: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      priceQt1: '',
      cost: '',
      profit: ''
    });
    this.offersForm = this.fb.group({
      debit: false,
      clientID: '',
      itemID: '',
      searchBarCode: '',
      company: ['', Validators.required],
      mounth: ['', Validators.required],
      credits: ['', Validators.required],
      price: ['', Validators.required]
    })
    this.creditTransfersForm = this.fb.group({
      debit: false,
      clientID: '',
      company: ['', Validators.required],
      credits: ['', Validators.required],
      price: ['', Validators.required]
    })
    this.accessoriesForm = this.fb.group({
      debit:false,
      clientID:'',
      searchAccessories: '',
      totalPrice:['', Validators.required],
      items: this.fb.array([])
    });
    this.centralForm = this.fb.group({
      country: ['', Validators.required],
      mins: ['', Validators.required],
      price: ['', Validators.required]
    });
    this.clientDebitForm = this.fb.group({
      clientID: [''],
      searchClient: '',
      clientName: ['']
    });
    this.countrys=this.filteredCountrys= this.sellService.getCountry();
    this.onClientNameChange();
    this.onRechargeCardChange();
    this.onOffersChange();
    this.onCreditsTransfersChange();
    this.onItemNameChange();
    this.getRechargeCard();
    this.getOffers();
    this.getCreditsTransfers();
    this.onCentralNameChange();
  }
  onCentralNameChange(): void{
    this.centralForm.get('country').valueChanges.subscribe(val => {
      var data = this.centralForm.get('country').value;
      if (data == "" || data==null) {
        this.filteredCountrys=this.countrys;
      } else if(data!=""){
        const filterValue = data.toLowerCase();
        data = this.countrys.filter(country => country.name.toLowerCase().indexOf(filterValue) === 0);
        if(data==""){
          this.filteredCountrys=this.countrys;
        } else{
          this.filteredCountrys=data;
        }
      }
    });
  }
  onItemNameChange(): void {
    this.accessoriesForm.get('searchAccessories').valueChanges.subscribe(val => {
      var data = this.accessoriesForm.get('searchAccessories').value;
      if (data == "") {
        this.accessories = [];
        return;
      }
      this.sellService.searchAccessories(data).subscribe(Response => {
        this.accessories = Response;
      })
    });
  }
  public updatePriceAccessories() {
    var profit = 0;
    var total = 0;
    for (var i = 0; i < this.itemsForm.controls.length; i++) {
      var price = this.itemsForm.controls[i].get('price').value;
      var cost = this.itemsForm.controls[i].get('cost').value;
      var rowTotalPrice = this.itemsForm.controls[i].get('rowTotalPrice').value;
      var itemTotalPrice=(this.itemsForm.controls[i].get('price').value)*(this.itemsForm.controls[i].get('quantity').value);
      profit=itemTotalPrice - ((this.itemsForm.controls[i].get('cost').value) * (this.itemsForm.controls[i].get('quantity').value));
      this.itemsForm.controls[i].get('profit').setValue(profit);
      this.itemsForm.controls[i].get('rowTotalPrice').setValue(itemTotalPrice);
      total = total  + itemTotalPrice;
    }
    this.accessoriesForm.get('totalPrice').setValue(total);
  }
  onRechargeCardChange(): void {
    this.fullCardForm.get('searchBarCode').valueChanges.subscribe(val => {
      var data = this.fullCardForm.get('searchBarCode').value;
      for (var i = 0; i < this.rechargeCard.length; i++) {
        if (this.rechargeCard[i].bar_code == data) {
          this.fullCardForm.get('cardName').setValue(this.rechargeCard[i].name);
          return;
        } 
      }
    });
    this.fullCardForm.get('quantity').valueChanges.subscribe(val => {
      this.changePriceFullCard(false);
    });
  }
  onOffersChange(): void {
    this.offersForm.get('searchBarCode').valueChanges.subscribe(val => {
      var data = this.offersForm.get('searchBarCode').value;
      for (var i = 0; i < this.offers.length; i++) {
        
        if (this.offers[i].bar_code == data) {
          this.offersForm.get('itemID').setValue(this.offers[i].IID);
          this.offersForm.get('company').setValue(this.offers[i].company);
          this.offersForm.get('mounth').setValue(this.offers[i].num_of_mounth);
          this.offersForm.get('credits').setValue(this.offers[i].num_of_credit);
          this.offersForm.get('price').setValue(this.offers[i].price);
          return;
        } 
        this.offersForm.get('itemID').setValue('');
        this.offersForm.get('company').setValue('');
        this.offersForm.get('mounth').setValue('');
        this.offersForm.get('credits').setValue('');
        this.offersForm.get('price').setValue('');
      }
    });
  }
  onCreditsTransfersChange(): void {
    this.creditTransfersForm.get('company').valueChanges.subscribe(val => {
      this.changePriceCreditsTransfers();
    });
    this.creditTransfersForm.get('credits').valueChanges.subscribe(val => {
      this.changePriceCreditsTransfers();
    });
  }
  changePriceCreditsTransfers() {
    var company = this.creditTransfersForm.get('company').value;
    var credits = this.creditTransfersForm.get('credits').value;
    this.creditTransfersForm.get('price').setValue('');
    for (var i = 0; i < this.credits.length; i++) {
      if (this.credits[i].company == company && this.credits[i].num_of_credit == credits) {
        this.creditTransfersForm.get('price').setValue(this.credits[i].price);
        break;
      }
    }
  }
  changePriceFullCard(edit){
    if(edit==false){
      var quantity = this.fullCardForm.get('quantity').value;
      var priceQt1 = this.fullCardForm.get("priceQt1").value;
      var price = quantity * priceQt1;
      this.fullCardForm.get("price").setValue(price);
    }
  }
  getRechargeCard() {
    this.sellService.getRechargeCard().subscribe(Response => {
      this.rechargeCard = Response;
    })
  }
  getOffers() {
    this.sellService.getOffers().subscribe(Response => {
      this.offers = Response;
    })
  }
  getCreditsTransfers(){
    this.sellService.getCreditsTransfers().subscribe(Response=>{
      this.credits = Response;
    })
  }
  onClientNameChange(): void {
    this.clientDebitForm.get('searchClient').valueChanges.subscribe(val => {
      var data = this.clientDebitForm.get('searchClient').value;
      if (data == "") {
        this.clients = [];
        return;
      }
      this.sellService.searchClient(data).subscribe(Response => {
        this.clients = Response;
      })
    });
  }
  searchClientChange(id, name, phone) {
    this.clientDebitForm.get('searchClient').setValue('');
    this.clientDebitForm.get('clientName').setValue(name);
    this.clientDebitForm.get('clientID').setValue(id);
  }
  selectRechargeCard(event, rc) {
    if (event.source.selected) {
      this.fullCardForm.get('itemID').setValue(rc.IID);
      this.fullCardForm.get('quantity').setValue(1);
      this.fullCardForm.get('price').setValue(rc.price);
      this.fullCardForm.get('priceQt1').setValue(rc.price);
      this.fullCardForm.get('cost').setValue(rc.cost);
    }
  }
  deleteItem(i) {
    this.itemsForm.removeAt(i);
    this.updatePriceAccessories();
  }
  addItem(id, name,price,cost) {
    this.accessoriesForm.get('searchAccessories').setValue('');
    var profit = price - cost;
    const item = this.fb.group({
      name: [name],
      itemID: [id],
      quantity: [1, [Validators.required, Validators.min(1)]],
      cost:cost,
      profit:profit,
      price: [price, [Validators.required, Validators.min(1)]],
      rowTotalPrice:[price,[Validators.required, Validators.min(1)]]
    });
    this.itemsForm.push(item);
    this.updatePriceAccessories();
  }
  openClientModal(clientModal) {
    this.modalReference = this.modalService.open(clientModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var name = '';
    var phone = '';
    var address = '';
    this.clientForm = this.fb.group({
      name: [name, Validators.required],
      phone: [phone, Validators.required],
      address: [address, Validators.required]
    });
    document.getElementById("clientNameModal").focus();
  }
  addClient() {
    this.clientsService.addNewClient(this.clientForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text:'Client Add Successfully',
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
    document.getElementById("searchClient").focus();
  }
  clearForm() {
    this.clientForm.resetForm();
  }
  sellFullCard() {
    const fullCardformValue = this.fullCardForm.value;
    const clientDebitformValue = this.clientDebitForm.value;
    if (fullCardformValue['debit'] == true && (clientDebitformValue['clientID'] != '' 
    || clientDebitformValue['clientID'] != null))
    fullCardformValue['clientID']=clientDebitformValue['clientID'];
      var quantity = fullCardformValue['quantity'];
      var cost = fullCardformValue["cost"];
      var price = fullCardformValue["price"];
      var profit = price - (cost * quantity);
      fullCardformValue["profit"]=profit;
    this.sellService.sellFullCard(this.fullCardForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text:'Sell Full Card Successfully',
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
    this.fullCardForm.reset();
    this.clientDebitForm.reset();
    this.fullCardForm.get('debit').setValue(false);
  }
  sellOffers() {
    const offersformValue = this.offersForm.value;
    const clientDebitformValue = this.clientDebitForm.value;
    if (offersformValue['debit'] == true && (clientDebitformValue['clientID'] != '' 
    || clientDebitformValue['clientID'] != null))
      offersformValue['clientID'] = clientDebitformValue['clientID'];
    this.sellService.sellOffers(this.offersForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text:'Sell Offer Successfully',
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
    this.offersForm.reset();
    this.clientDebitForm.reset();
    this.offersForm.get('debit').setValue(false);
  }
  sellCreditTransfers() {
    const creditTransfersFormValue = this.creditTransfersForm.value;
    const clientDebitformValue = this.clientDebitForm.value;
    if (creditTransfersFormValue['debit'] == true && (clientDebitformValue['clientID'] != '' 
    || clientDebitformValue['clientID'] != null))
      creditTransfersFormValue['clientID'] = clientDebitformValue['clientID'];
    this.sellService.sellCreditTransfers(this.creditTransfersForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text:'Transfers Credits $ Successfully',
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
    this.creditTransfersForm.reset();
    this.clientDebitForm.reset();
    this.creditTransfersForm.get('debit').setValue(false);
  }
  sellAccessories(){
    const accessoriesFormFormValue = this.accessoriesForm.value;
    const clientDebitformValue = this.clientDebitForm.value;
    if(accessoriesFormFormValue['debit'] == true && (clientDebitformValue['clientID'] != '' 
    || clientDebitformValue['clientID'] != null))
      accessoriesFormFormValue['clientID']=clientDebitformValue['clientID'];
    if(this.itemsForm.controls.length>0){
      this.sellService.sellAccessories(this.accessoriesForm.value).subscribe(Response => {
        swal({
          type: 'success',
          title: 'Success',
          text:'Sell Accessories Successfully',
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
      this.accessoriesForm.reset();
      this.clientDebitForm.reset();
      this.accessoriesForm.get('debit').setValue(false);
      for(var i=this.itemsForm.controls.length-1;i>=0;i--){
        this.deleteItem(i);
      }
    }
  }
  sellCentral() {
    const formValue = this.centralForm.value;
    this.sellService.addSellCentral(this.centralForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text:'Sell Central Successfully',
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
    this.centralForm.reset();
    this.filteredCountrys=this.countrys;
  }
  get searchBarCodeFullCard() {
    return this.fullCardForm.get('searchBarCode');
  }
  get cardName() {
    return this.fullCardForm.get('cardName');
  }
  get quantityFullCard() {
    return this.fullCardForm.get('quantity');
  }
  get priceFullCard() {
    return this.fullCardForm.get('price');
  }
  get searchBarCodeDays() {
    return this.offersForm.get('searchBarCode');
  }
  get companyDays() {
    return this.offersForm.get('company');
  }

  get mounthDays() {
    return this.offersForm.get('mounth');
  }
  get creditsDays() {
    return this.offersForm.get('credits');
  }
  get priceDays() {
    return this.offersForm.get('price');
  }

  get companyCreditTransfers() {
    return this.creditTransfersForm.get('company');
  }
  get creditscreditTransfers() {
    return this.creditTransfersForm.get('credits');
  }
  get pricecreditTransfers() {
    return this.creditTransfersForm.get('price');
  }
  get name() {
    return this.clientForm.get('name');
  }
  get phoneNumber() {
    return this.clientForm.get('phone');
  }
  get address() {
    return this.clientForm.get('address');
  }
  get clientName() {
    return this.clientDebitForm.get('clientName');
  }
  get clientPhone() {
    return this.clientDebitForm.get('clientPhone');
  }
  get mins() {
    return this.centralForm.get('mins');
  }
  get country() {
    return this.centralForm.get('country');
  }

  get price() {
    return this.centralForm.get('price');
  }
  get itemsForm() {
    return this.accessoriesForm.get('items') as FormArray
  }
}

