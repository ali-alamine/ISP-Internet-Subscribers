<?php
ini_set('max_execution_time', 0); 
ini_set('memory_limit','6028M');
require APPPATH . '/libraries/REST_Controller.php';
class subscriber extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('subscriber_model');
    }     
    public function subscriber_post(){
        $name = $this->post('name');
        $username = $this->post('username');
        $phone = $this->post('phone');
        $address = $this->post('address');
        $profile = $this->post('profile');
        $result = $this->subscriber_model->add(array("name" => $name,"username" => $username, "phone" => $phone, "address" => $address, "profile" => $profile));

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }   

    public function newSubscription_post()
    {
        $profile = $this->post('profile');
        $subID = $this->post('subID');
        $isPaid = $this->post('isPaid');
        $expDate = $this->post('expDate');
        $subDate = $this->post('subDate');        
        if($isPaid){
            date_default_timezone_set("Asia/Beirut");
            $paymentDate=date("Y-m-d H:i:s");
        }
        else{
            $paymentDate='';
        }
        $result = $this->subscriber_model->addSubscription(array("SBID" => $subID,
         "sub_date" => $subDate, "payment_date" => $paymentDate, "exp_date" => $expDate, "profile" => $profile, "is_paid" => $isPaid));

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }

    }

    public function getMonths_get()
    {
        $subscriberID = $this->get('subscriberID');
        $result = $this->subscriber_model->getMonths($subscriberID);
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }

    

    public function subscriber_put(){
        $subscriber_name = $this->put('name');
        $subscriber_username = $this->put('username');
        $subscriber_phone = $this->put('phone');
        $subscriber_address = $this->put('address');
        $subscriber_profile = $this->put('profile');
        $subscriberID = $this->put('id');

        $result = $this->subscriber_model->update($subscriberID, array("name" => $subscriber_name,"username" => $subscriber_username, "phone" => $subscriber_phone, "address" => $subscriber_address, "profile" => $subscriber_profile));
        if ($result === 0) {
            $this->response("subscriber information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    public function enableDisableSub_put(){
        $subscriberID = $this->put('id');
        $result = $this->subscriber_model->toggleActivation($subscriberID);
        if ($result === 0) {
            $this->response("subscriber information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    public function autoSubscription_get(){
        $result = $this->subscriber_model->autoSubscription();
        if ($result) {
            $this->response($result, 200);
        } else {
            $this->response("Error", 404);
        }
    }

    public function setUnsetPayment_put(){        
        $subDetailsID = $this->put('id');
        $subID = $this->put('subID');
        $isPaid = $this->put('isPaid');
        $profile = $this->put('profile');
        $result;
        if($isPaid){
            $result = $this->subscriber_model->setUnpaid($subDetailsID);
            $result2 = $this->subscriber_model->incrementDebitAmountDue($subID,$profile);
        }
        else{
            $result = $this->subscriber_model->setPaid($subDetailsID);
            $result2 = $this->subscriber_model->decrementDebitAmountDue($subID,$profile);
        }
        
        if ($result === 0) {
            $this->response("subscriber information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    public function submitDebitPaymentAmount_put(){        
        $subID = $this->put('subID');
        $paymentAmount = $this->put('paymentAmount');
        $result;

        $result = $this->subscriber_model->incrementDebitAmountDue($subID,$paymentAmount);
  
        
        if ($result === 0) {
            $this->response("Payment could not be completed, Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    public function deleteSubscription_put()
    {
        
        $subDetailsID = $this->put('id');
        $result = $this->subscriber_model->deleteSubscription($subDetailsID);
        if ($result === 0) {
            $this->response("subscriber information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    

    
    
}
