<?php
class sell_model extends CI_Model{
    public function __construct(){
        $this->load->database();
    }
    public function add($table,$data){
        if ($this->db->insert($table, $data)) {
            return true;
        } else {
            return false;
        }
    }
    public function updateItem($id, $table,$quantity){
        $this->db->where('IID', $id);
        $this->db->set('quantity','quantity - '. $quantity,FALSE);
        if ($this->db->update($table)) {
            return true;
        } else {
            return false;
        }
    }
    public function updateCredits($id,$credits,$operation){
        $this->db->where('IID', $id);
        $this->db->set('credits','credits'.$operation. $credits,FALSE);
        if ($this->db->update('credit')) {
            return true;
        } else {
            return false;
        }
    }
    public function updatePerson($id, $debit){
        $this->db->where('PID', $id);
        $this->db->set('debit','debit + '. $debit,FALSE);
        if ($this->db->update('person')) {
            return true;
        } else {
            return false;
        }
    }

    public function delete($id){
        $this->db->where('IID', $id);
        if ($this->db->delete('item')) {
            return true;
        } else {
            return false;
        }
    }

    public function searchClient($data){
        $this->db->select("PID,name,phone");
        $this->db->from("person");
        $this->db->where('is_client=1 and PID != 1');
        $this->db->like('name',$data,'both'); 
        $this->db->limit(10, 0);
        $query = $this->db->get(); 
        $ss=$this->db->last_query();  
        return $query->result();
    }

    public function rechargeCard(){ 
        $query = $this->db->query('SELECT * FROM recharge_card INNER JOIN item ON item.IID = recharge_card.IID WHERE item.type="RC"');
        $ss=$this->db->last_query();  
        return $query->result();
    }

    public function offers(){ 
        $query = $this->db->query('SELECT * FROM offers INNER JOIN item ON item.IID = offers.IID WHERE item.type="OF"');
        $ss=$this->db->last_query();  
        return $query->result();
    }

    public function creditsTransfers(){ 
        $query = $this->db->query('SELECT * FROM offers INNER JOIN item ON item.IID = offers.IID WHERE item.type="CT"');
        $ss=$this->db->last_query();  
        return $query->result();
    }
    
    public function searchAccessories($search){
        $query = $this->db->query('SELECT * FROM accessories INNER JOIN item ON item.IID = accessories.IID WHERE item.type="AC" and ( name LIKE "%' . $search . '%" OR bar_code LIKE "%' . $search . '%") ');
        $ss=$this->db->last_query();  
        return $query->result();
    }
}
