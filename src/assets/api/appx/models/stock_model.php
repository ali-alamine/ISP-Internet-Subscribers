<?php
class stock_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function add($table,$data)
    {
        if ($this->db->insert($table, $data)) {
            if($table!="item"){
                return true;
            } else{
                $IID = $this->db->insert_id();
                return $IID;
            }
        } else {
            return false;
        }
    }
    public function update ($table,$id, $data){
        $this->db->where('IID', $id);
        if ($this->db->update($table, $data)) {
            return true;
        } else {
            return false;
        }
    }
    // public function delete($id){
    //     $this->db->where('IID', $id);
    //     if ($this->db->delete('item')) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    public function searchItem($data){
        $this->db->select("*");
        $this->db->from("item");
        $this->db->like('name',$data,'both');
        $this->db->or_like('bar_code', $data,'both'); 
        $this->db->limit(10, 0);
        $query = $this->db->get(); 
        $ss=$this->db->last_query();  
        return $query->result();
    }

}
