<?php
class centralInvoice_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function deleteInvoice($id)
    {
        $this->db->where('INVCID', $id);
        if ($this->db->delete('invoice_central')) {
            return true;
        } else {
            return false;
        }
    }

    
}
