<?php
class settings_model extends CI_Model{
    public function __construct(){
        $this->load->database();
    }
    public function checkPass($pass){
        $this->db->select('*');
        $this->db->from('setting');
        $this->db->where('password', $pass);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }


    public function updatePass($newPass){
        $this->db->set('password',$newPass, true);
        if ($this->db->update('setting')) {
            return true;
        } else {
            return false;
        }
    }
}