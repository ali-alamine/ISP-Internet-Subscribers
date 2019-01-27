<?php
class supply_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    public function searchSupplier($name){
        $this->db->select('*');
        $this->db->from('person');
        $this->db->like('name', $name, 'after'); 
        $this->db->where('is_client', 0);
        $this->db->limit(20);
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function searchItem($search,$type){
        if($type=="RC"){
            $query = $this->db->query('SELECT * FROM item   
            INNER JOIN recharge_card ON item.IID = recharge_card.IID 
            WHERE item.type="RC" and 
        ( name LIKE "' . $search . '%" OR bar_code = "' . $search . '") ');

        }else if($type=="AC"){
            $query = $this->db->query('SELECT * FROM item   
            INNER JOIN accessories ON item.IID = accessories.IID 
            WHERE item.type="AC" and 
            ( name LIKE "' . $search . '%" OR bar_code = "' . $search . '") ');
        }
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function add($table,$data){
        if ($this->db->insert($table, $data)) {
            if($table=="supply"){
                return true;
            } else{
                $SDID = $this->db->insert_id();
                return $SDID;
            }
        } else {
            return false;
        }
    }
    public function updateItem($id, $table,$quantity,$cost){
        $this->db->where('IID', $id);
        $this->db->set('quantity','quantity + '. $quantity,FALSE);
        $this->db->set('cost',$cost,FALSE);
        if ($this->db->update($table)) {
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
}
