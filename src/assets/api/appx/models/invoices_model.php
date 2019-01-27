<?php
class invoices_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

   
    
    public function deleteInvoice($id,$quantity,$itemID)
    {
        $this->db->trans_start();
        $this->db->where('INVID', $id);
        $this->db->delete('invoice');
        $this->db->query('update accessories set quantity = quantity + ' . $quantity . ' where IID = '.$itemID);

        $this->db->trans_complete();

        if ($this->db->trans_status()) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteRechargeCardInvoice($id,$quantity,$itemID)
    {
        $this->db->trans_start();
        $this->db->where('INVID', $id);
        $this->db->delete('invoice');
        $this->db->query('update recharge_card set quantity = quantity + ' . $quantity . ' where IID = '.$itemID);

        $this->db->trans_complete();

        if ($this->db->trans_status()) {
            return true;
        } else {
            return false;
        }
    }

   

}
