<?php
class suppliers_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function add($data)
    {
        if ($this->db->insert('person', $data)) {
            return true;
        } else {
            return false;
        }
    }

    public function update($id, $data)
    {
        $this->db->where('PID', $id);
        if ($this->db->update('person', $data)) {
            return true;
        } else {
            return false;
        }

    }

    public function updateDebit($id, $amount)
    {
        $this->db->set('debit', 'debit -'. $amount, FALSE);
        $this->db->where('PID', $id);
        if ($this->db->update('person')) {
            return true;
        } else {
            return false;
        }

    }
    
    

}
