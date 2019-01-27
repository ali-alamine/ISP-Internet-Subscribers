<?php
require APPPATH . '/libraries/REST_Controller.php';
class supply extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('supply_model');
    }

    public function searchSupplier_get(){
        $keyword = $this->get('keyword');
        $result = $this->supply_model->searchSupplier($keyword);      
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }
    public function searchItem_get(){
        $keyword = $this->get('keyword');
        $type = $this->get('type');
        $result = $this->supply_model->searchItem($keyword,$type);      
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }
    public function addSupply_post(){
        date_default_timezone_set("Asia/Beirut");
        $PID = $this->post('supplierID');
        $totalPrice = $this->post('totalPrice');
        $date = $this->post('supplyDate');       
        $dt = new DateTime($date); 
        $dt->setTimezone(new DateTimeZone('Asia/Beirut'));
        $paid = $this->post('paid');
        $type = $this->post('type');
        $drawer = $this->post('drawer');
        $rest = $totalPrice - $paid;
        if($paid==0) $paid=$totalPrice;
        $items = $this->post('items');
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        $SDID = $this->supply_model->add('supply_detail',array("PID" => $PID,"sup_date"=>$dt->format('Y-m-d H:i:s'),"total_cost"=>$totalPrice,"rest"=>$rest,
        "invoice_type"=>$type,"invoice_drawer"=>$drawer));
        if ($SDID === 0) {
            $this->response("supply Detail information could not be saved. Try again.", 404);
        } else {
            foreach ($items as $item){
                $resultAdd = $this->supply_model->add('supply',array("SDID" => $SDID, "IID" => $item['itemID'],"quantity" => $item['quantity'],
                "cost"=>$item['price']));
                if($type=="AC"){
                    $resultUpdate = $this->supply_model->updateItem($item['itemID'],'accessories',$item['quantity'],$item['price']);
                } else if($type=="RC"){
                    $resultUpdate = $this->supply_model->updateItem($item['itemID'],'recharge_card',$item['quantity'],$item['price']);
                }
            }
            $resultPayment=$this->supply_model->add('payment',array("SDID"=>$SDID,"payment_date"=>$dt->format('Y-m-d H:i:s'),"amount"=>$paid,
            "comment"=>"First Payment","drawer_type"=>$drawer));
        }
        if($rest>0)
            $resultUpdateSupplier= $this->supply_model->updatePerson($PID,$rest);
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
}
