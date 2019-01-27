<?php
require APPPATH . '/libraries/REST_Controller.php';
class omt extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('omt_model');
    }

    public function addOMTOperation_post()
    {
        $amountD = $this->post('amountD');
        $amountL = $this->post('amountL');
        $clientID = $this->post('clientID');
        $currency = $this->post('currency');
        $operationType = $this->post('operationType');
        $tranType = $this->post('tranType');

        if ($clientID == 1) {
            $paid = 1;
        } else {
            $paid = 0;
        }

        $result = $this->omt_model->add(array("oper_type" => $operationType, "oper_amount_d" => $amountD, "oper_amount_l" => $amountL, "oper_tran_type" => $tranType, "oper_currency" => $currency, "oper_is_paid" => $paid, "oper_client_id" => $clientID));
        $result2 = $this->omt_model->updatePersonOmtDebit($clientID, $amountL);

        if ($result === 0 || $result2 === 0) {
            $this->response("omt information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }

    }

    public function deleteOperation_get()
    {
        $json = $this->get('data');
        $data = json_decode($json, true);

        $oper_id = $data['oper_id'];
        $oper_is_paid = $data['oper_is_paid'];
        $oper_amount_l = $data['oper_amount_l'];
        $oper_client_id = $data['oper_client_id'];

        $result = $this->omt_model->deleteOperation($oper_id);
        if ($result) {
            if ($oper_is_paid == 0) {
                $result2 = $this->omt_model->updatePersonOmtDebit($oper_client_id, -$oper_amount_l);
            } else {
                $this->response($result, 200);
                exit;
            }
        } else {
            $this->response('error', 404);
            exit;
        }

        if ($result2) {
            $this->response($result, 200);
            exit;
        } else {
            $this->response('error', 404);
            exit;
        }
    }

    public function omtTotalToday_get()
    {
        $result = $this->omt_model->getOmtTotalToday();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function setTransactionAsPaid_get(){

        $operID = $this->get('operID');
        $personID = $this->get('personID');
        $amountL = $this->get('amountL');

        $result1 = $this->omt_model->setTransactionAsPaid($operID);
        $result2 = $this->omt_model->updatePersonOmtDebit($personID,-$amountL);

        if ($result1 && $result2) {
            $this->response($result1, 200);
            exit;
        }
    }

}


