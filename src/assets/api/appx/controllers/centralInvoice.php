<?php
require APPPATH . '/libraries/REST_Controller.php';
class centralInvoice extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('centralInvoice_model');
    }


    public function deleteInvoice_put()
    {
        
        $invoiceID = $this->put('ID');
        $invoiceAmount = $this->put('price');

        $result = $this->centralInvoice_model->deleteInvoice($invoiceID);
        if ($result === 0) {
            $this->response("invoice information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

      
    
}
