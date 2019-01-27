<?php
class omt_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function add($data)
    {
        if ($this->db->insert('omt_operation', $data)) {
            return true;
        } else {
            return false;
        }
    }

    public function updatePersonOmtDebit($id, $debit){
        $this->db->where('PID', $id);
        $this->db->set('omt_debit','omt_debit + '. $debit,FALSE);
        if ($this->db->update('person')) {
            return true;
        } else {
            return false;
        }
    }

    public function setTransactionAsPaid($id){
        $this->db->where('oper_id', $id);
        $this->db->set('oper_is_paid',1,FALSE);
        $this->db->set('oper_date','DEFAULT',FALSE);
        if ($this->db->update('omt_operation')) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteOperation($id){
        $this->db->where('oper_id', $id);
        if ($this->db->delete('omt_operation')) {
            return true;
        } else {
            return false;
        }
    }

    public function getOmtTotalToday()
    {
        $query = $this->db->query("select sum(oper_amount_l) as total,oper_type,oper_tran_type from omt_operation where DATE(oper_date) = DATE(NOW()) and oper_type in ('in','wu') GROUP by oper_type,oper_tran_type");

        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }

    }

    
 


}
