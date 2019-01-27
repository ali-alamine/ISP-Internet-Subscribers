<?php
require APPPATH . '/libraries/REST_Controller.php';
class supplyInvoices extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('supplyInvoices_model');
    }

    public function invoiceDetails_get()
    {
        $invoiceID = $this->get('invoiceID');
        $result = $this->supplyInvoices_model->getInvoiceDetails($invoiceID);
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }

    public function invoicePayments_get()
    {
        $invoiceID = $this->get('invoiceID');
        $result = $this->supplyInvoices_model->getInvoicePayments($invoiceID);
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }

    public function payment_post()
    {

        $invoiceID = $this->post('invoiceID');
        $comment = $this->post('comment');
        $amount = $this->post('amount');
        $supplierID = $this->post('supplierID');
        $drawer = $this->post('drawerType');

        date_default_timezone_set("Asia/Beirut");
        $now = date('Y-m-d H:i:s');

        $result = $this->supplyInvoices_model->addPayment(array("SDID" => $invoiceID, "payment_date" => $now, "amount" => $amount, "comment" => $comment,"drawer_type" => $drawer));

        $result2 = $this->supplyInvoices_model->updateDebit($supplierID, $amount);
        $result3 = $this->supplyInvoices_model->updateinvoiceRest($invoiceID, $amount);

        if ($result !== 0 && $result2 !== 0 && $result3 !== 0) {
            $this->response("success", 200);

        } else {
            $this->response("payment information could not be saved. Try again.", 404);
        }

    }

}
