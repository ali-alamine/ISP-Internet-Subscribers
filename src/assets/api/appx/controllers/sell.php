<?php
require APPPATH . '/libraries/REST_Controller.php';
class sell extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('sell_model');
    }
    public function sellFullCard_post(){
        $CID = $this->post('clientID');
        $IID = $this->post('itemID');
        $quantity = $this->post('quantity');
        $price = $this->post('price');
        $profit = $this->post('profit');
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d H:i:s");
        $resultUpdate = $this->sell_model->updateItem($IID,'recharge_card',$quantity);
        if($CID != null || $CID != ''){
            $resultAdd = $this->sell_model->add('invoice',array("PID" => $CID, "IID" => $IID,
            "date" => $date,"quantity" => $quantity,"price"=>$price,"profit"=>$profit,"type" => 'RC',"is_debit"=>1));
            $resultUpdateClient = $this->sell_model->updatePerson($CID,$price);
        } else{
            $resultAdd = $this->sell_model->add('invoice',array("PID" => 1, "IID" => $IID,
            "date" => $date,"quantity" => $quantity,"price"=>$price,"profit"=>$profit,"type" => 'RC'));
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    } 
    public function sellOffers_post(){
        $CID = $this->post('clientID');
        $IID = $this->post('itemID');
        $company = $this->post('company');
        $mounth = $this->post('mounth');
        $credits = $this->post('credits');
        $price = $this->post('price');
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d H:i:s");
        if($IID=='')
            $IID=1;//id fixe offers no insert
        if($company=="ALFA"){
            $RCIID=2;//id fixe
            $CTIID=4;//id fixe
        }
        else{
            $RCIID=3;//id fixe
            $CTIID=5;//id fixe
        }
        $resultUpdate = $this->sell_model->updateItem($RCIID,'recharge_card',$mounth);
        $credits=$mounth*20-$credits;
        $resultUpdate = $this->sell_model->updateCredits($CTIID,$credits,'+');
        if($CID!=null){
            $resultAdd = $this->sell_model->add('invoice',array("PID" => $CID, "IID" => $IID,
                "date" => $date,"quantity" => 1,"price"=>$price,"type" => 'OF',"is_debit"=>1));
            $resultUpdateClient = $this->sell_model->updatePerson($CID,$price);
        }else{
            $resultAdd = $this->sell_model->add('invoice',array("PID" => 1, "IID" => $IID,
            "date" => $date,"quantity" => 1,"price"=>$price,"type" => 'OF'));
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }
    public function sellCreditTransfers_post(){
        $CID = $this->post('clientID');
        $company = $this->post('company');
        $credits = $this->post('credits');
        $price = $this->post('price');
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d H:i:s");
        if($company=="ALFA")
            $IID=4;//id fixe
        else
            $IID=5;//id fixe
        $resultUpdate = $this->sell_model->updateCredits($IID,$credits,'-');
        if($CID!=null){
            $resultAdd = $this->sell_model->add('invoice',array("PID" => $CID, "IID" => $IID,
                "date" => $date,"quantity" => $credits,"price"=>$price,"type" => 'CT',"is_debit"=>1));
            $resultUpdateClient = $this->sell_model->updatePerson($CID,$price);
        } else{
            $resultAdd = $this->sell_model->add('invoice',array("PID" => 1, "IID" => $IID,
                "date" => $date,"quantity" => $credits,"price"=>$price,"type" => 'CT'));
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }
    public function sellAccessories_post(){
        $CID = $this->post('clientID');
        $totalPrice = $this->post('totalPrice');
        $items = $this->post('items');
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d H:i:s");
        foreach ($items as $item){
            if($CID!=null){
                $resultAdd = $this->sell_model->add('invoice',array("PID" => $CID, "IID" => $item['itemID'],
                "date" => $date,"quantity" => $item['quantity'],"price"=>$item['rowTotalPrice'],
                "profit"=>$item['profit'],"type" => 'AC',"is_debit"=>1));
            }else{
                $resultAdd = $this->sell_model->add('invoice',array("PID" => 1, "IID" => $item['itemID'],
                "date" => $date,"quantity" => $item['quantity'],"price"=>$item['rowTotalPrice'],
                "profit"=>$item['profit'],"type" => 'AC'));
            }
            $resultUpdate = $this->sell_model->updateItem($item['itemID'],'accessories',$item['quantity']);
        }
        if($CID!=null){
            $resultUpdateClient = $this->sell_model->updatePerson($CID,$totalPrice);
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }
    public function sellCentral_post(){
        $country = $this->post('country');
        $mins = $this->post('mins');
        $price = $this->post('price');
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d H:i:s");
        $resultAdd = $this->sell_model->add('invoice_central',array("country"=>$country,
        "date" => $date,"duration" => $mins,"price"=>$price));
        if ($resultAdd === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    public function searchClient_get(){
        $searchInput = $this->get('searchInput');
        $result = $this->sell_model->searchClient($searchInput);
        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }
    public function rechargeCart_get(){
        $result = $this->sell_model->rechargeCard();
        if ($result === 0) {
            $this->response("recharge Card information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    } 
    public function offers_get(){
        $result = $this->sell_model->offers();
        if ($result === 0) {
            $this->response("Offers information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }
    public function creditsTransfers_get(){
        $result = $this->sell_model->creditsTransfers();
        if ($result === 0) {
            $this->response("credits Transfers information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }
     
    public function searchAccessories_get(){
        $keyword = $this->get('keyword');
        $result = $this->sell_model->searchAccessories($keyword);      
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }
}
