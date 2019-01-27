<?php
class subscriber_model extends CI_Model{
    public function __construct(){
        $this->load->database();
    }
    public function add($data){
        if ($this->db->insert('subscriber', $data)) {
            return true;
        } else {
            return false;
        }
    }
    public function autoSubscription(){
        $query = $this->db->query('SELECT subscriber.SBID,subscriber.profile,maxDate FROM 
        (SELECT DISTINCT SBID, MAX(exp_date) AS maxDate FROM subscriber_detail GROUP BY SBID ) as Sub1 
        INNER JOIN subscriber 
        ON subscriber.SBID = Sub1.SBID 
        where 
        maxDate <= CURDATE() and subscriber.is_activated=1');
        foreach ($query->result() as $row) {
            $maxDate= $row->maxDate .'';
            $expDate = date('Y-m-d', strtotime($maxDate . "+1 months") ) .'';
            $data = array("SBID" => $row->SBID, "profile" => $row->profile,'sub_date'  =>  $maxDate, "exp_date" => $expDate);
            $this->db->set('payment_date', 'NULL', FALSE);
            $this->db->insert('subscriber_detail', $data);

            /* increment amount due by 'profile amount' */
            $this->db->set('amountDue', 'amountDue + '.$row->profile, false);
            $this->db->where('SBID', $row->SBID);  
            if ($this->db->update('subscriber')) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
    public function update ($id, $data){
        $this->db->where('SBID', $id);
        if ($this->db->update('subscriber', $data)) {
            return true;
        } else {
            return false;
        }
    }
    public function incrementDebitAmountDue ($id, $amount){
        $this->db->set('amountDue', 'amountDue + '.$amount, false);
        $this->db->where('SBID', $id);  
        if ($this->db->update('subscriber')) {
            return true;
        } else {
            return false;
        }
    }
    public function decrementDebitAmountDue ($id, $amount){
        $this->db->set('amountDue', 'amountDue - '.$amount, false);
        $this->db->where('SBID', $id);        
        if ($this->db->update('subscriber')) {
            return true;
        } else {
            return false;
        }

    }
    public function toggleActivation ($id){

        $this->db->set('is_activated', '!is_activated', FALSE);
        $this->db->where('SBID', $id);        
        if ($this->db->update('subscriber')) {
            return true;
        } else {
            return false;
        }

    }
    public function togglePayment($id){
        $this->db->set('is_paid', '!is_paid', FALSE);
        $this->db->set('payment_date', 'NULL', FALSE);
        $this->db->where('SBDID', $id);        
        if ($this->db->update('subscriber_detail')) {
            return true;
        } else {
            return false;
        }
    }
    public function setUnpaid($id){
        $this->db->set('is_paid', '!is_paid', FALSE);
        $this->db->set('payment_date', 'NULL', FALSE);
        $this->db->where('SBDID', $id);        
        if ($this->db->update('subscriber_detail')) {
            return true;
        } else {
            return false;
        }
    }
    public function setPaid($id){
        // date_default_timezone_set('Asia/Beirut');
        // $now = date('Y-m-d H:i:s');

        $this->db->set('is_paid', '!is_paid', FALSE);
        $this->db->set('payment_date', 'NOW()', FALSE);
        $this->db->where('SBDID', $id);        
        if ($this->db->update('subscriber_detail')) {
            return true;
        } else {
            return false;
        }
    }
    public function addSubscription($data){
        if ($this->db->insert('subscriber_detail', $data)) {
            if($data['is_paid'] == 0){
                $this->db->set('amountDue', 'amountDue + '.$data['profile'], false);
                $this->db->where('SBID', $data['SBID']);        
                if ($this->db->update('subscriber')) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
    public function deleteSubscription($id){
        $this->db->where('SBDID', $id);
        if ($this->db->delete('subscriber_detail')) {
            return true;
        } else {
            return false;
        }
    }
    public function getMonths($subscriberID){
        $this->db->select('*');
        $this->db->from('subscriber');
        $this->db->join('subscriber_detail', 'subscriber.SBID = subscriber_detail.SBID', 'inner');
        $this->db->where('subscriber_detail.SBID', $subscriberID);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
}
