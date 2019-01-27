<?php
class supplyInvoices_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function getInvoiceDetails($invoiceID)
    {
        $this->db->select('*');
        $this->db->from('supply');
        $this->db->join('item', 'supply.IID = item.IID', 'inner');
        $this->db->where('SDID', $invoiceID);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }

    }

    public function getInvoicePayments($invoiceID)
    {
        $this->db->select('*');
        $this->db->from('payment');
        $this->db->where('SDID', $invoiceID);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }

    }

    public function addPayment($data)
    {
        if ($this->db->insert('payment', $data)) {
            return true;
        } else {
            return false;
        }
    }

    public function updateinvoiceRest($id, $amount)
    {
        $this->db->set('rest', 'rest -' . $amount, false);
        $this->db->where('SDID', $id);
        if ($this->db->update('supply_detail')) {
            return true;
        } else {
            return false;
        }

    }

    public function updateDebit($id, $amount)
    {
        $this->db->set('debit', 'debit -' . $amount, false);
        $this->db->where('PID', $id);
        if ($this->db->update('person')) {
            return true;
        } else {
            return false;
        }

    }

}
