<?php
require APPPATH . '/libraries/REST_Controller.php';
class invoices extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('invoices_model');
    }
    
    public function deleteInvoice_put() 
    {
        
        $invoiceID = $this->put('invoiceID');
        $invoicePrice = $this->put('price');
        $itemID = $this->put('IID');
        $quantity = $this->put('quantity');
        $invoiceProfit = $this->put('profit');
        $personID = $this->put('personID');

        $result = $this->invoices_model->deleteInvoice($invoiceID,$quantity,$itemID);
        if ($result === 0) {
            $this->response("invoice information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    
     
    public function deleteRechargeCardInvoice_put() 
    {
        
        $invoiceID = $this->put('INVID');
        $invoicePrice = $this->put('price');
        $itemID = $this->put('ID');
        $quantity = $this->put('quantity');
        $invoiceProfit = $this->put('profit');
        $personID = $this->put('personID');

        $result = $this->invoices_model->deleteRechargeCardInvoice($invoiceID,$quantity,$itemID);
        if ($result === 0) {
            $this->response("invoice information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    
    
}
