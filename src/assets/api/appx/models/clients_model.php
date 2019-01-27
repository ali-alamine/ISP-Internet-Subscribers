<?php
class clients_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function add($table,$data)
    {
        if ($this->db->insert($table, $data)) {
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

    public function getTotalDebit()
    {
        $this->db->select_sum('debit');
        $this->db->where('is_client', 1);
        $result = $this->db->get('person');

        if ($result->num_rows() > 0) {
            return $result->result_array();
        } else {
            return 0;
        }

    }
}
