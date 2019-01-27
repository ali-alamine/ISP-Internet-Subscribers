<?php
require APPPATH . '/libraries/REST_Controller.php';
class drawer extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('drawer_model');
    }

    public function internetDrawer_get()
    {

        $result = $this->drawer_model->getInternetDrawer();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function setDrawer_post()
    {
        $accessories = $this->post('accessories');
        $internetAmount = $this->post('internetAmount');
        $mobileDrawer = $this->post('mobileDrawer');
        $omtDrawer = $this->post('omt');

        date_default_timezone_set('Asia/Beirut');
        $today = date('Y-m-d H:i:s');

        $data = array(
            array('date' => $today, 'amount' => $accessories, 'profit' => 0, 'type' => 'a'),
            array('date' => $today, 'amount' => $mobileDrawer, 'profit' => 0, 'type' => 'm'),
            array('date' => $today, 'amount' => $internetAmount, 'profit' => 0, 'type' => 's'),
            array('date' => $today, 'amount' => $omtDrawer, 'profit' => 0, 'type' => 'o')
        );

        $result = $this->drawer_model->setDrawer($data);
        if ($result) {
            $this->setAccount();
            $this->sumOfAccountLast2Days();
            $this->response($result, 200);
            exit;
        }
    }

    public function setAccount(){
        date_default_timezone_set('Asia/Beirut');
        $today = date('Y-m-d H:i:s');
        
        $totalD = 0;
        $totalL = 0;

        $result = $this->drawer_model->calculateYesterdayAccount();
        if (!$result) {
            $data = array(
                array('date' => $today, 'amount' => 0, 'profit' => 0, 'type' => 'l'),
                array('date' => $today, 'amount' => 0, 'profit' => 0, 'type' => 'd')
            );
            $result2 = $this->drawer_model->setDrawer($data);
            if ($result2) {
                $this->response($result2, 200);
                exit;
            }
        }
        else{
            foreach($result as $row){
                if($row['oper_currency'] =='d' && $row['oper_tran_type'] == 'm' )
                    $totalD=$totalD+$row['total'];
                else if($row['oper_currency'] =='d' && $row['oper_tran_type'] == 'p' )
                    $totalD=$totalD-$row['total'];
                else if($row['oper_currency'] =='l' && $row['oper_tran_type'] == 'm' )
                    $totalL=$totalL+$row['total'];
                else if($row['oper_currency'] =='l' && $row['oper_tran_type'] == 'p' )
                    $totalL=$totalL-$row['total'];
                
            }

            $data2 = array(
                array('date' => $today, 'amount' => $totalL, 'profit' => 0, 'type' => 'l'),
                array('date' => $today, 'amount' => $totalD, 'profit' => 0, 'type' => 'd')
            );
            $result2 = $this->drawer_model->setDrawer($data2);
            if ($result2) {
                $this->response($result2, 200);
                exit;
            }


        }
    }

    public function accDrawer_get()
    {

        $result = $this->drawer_model->getAccDrawer();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function mobileDrawer_get()
    {

        $result = $this->drawer_model->getMobileDrawer();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function omtDrawer_get()
    {

        $result = $this->drawer_model->getOmtDrawer();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function newOperation_post()
    {
        $op_type = $this->post('op_type');
        $dra_type = $this->post('drawer');
        $amount = $this->post('amount');
        $comment = $this->post('comment');
        date_default_timezone_set('Asia/Beirut');
        $today = date('Y-m-d H:i:s');
        $result = $this->drawer_model->add('operation', array('date' => $today, 'amount' => $amount, 'note' => $comment,
            'op_type' => $op_type, 'dra_type' => $dra_type));
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function newTransferOperation_post()
    {
        $toDrawer = $this->post('toDrawer');
        $fromDrawer = $this->post('fromDrawer');
        $amount = $this->post('amount');
        $comment = $this->post('comment');
        date_default_timezone_set('Asia/Beirut');
        $today = date('Y-m-d H:i:s');
        $comment = 'Transfer Operation: '. $comment;

        $result1 = $this->drawer_model->add('operation', array('date' => $today, 'amount' => $amount, 'note' => $comment,
            'op_type' => 'w', 'dra_type' => $fromDrawer));

        $result2 = $this->drawer_model->add('operation', array('date' => $today, 'amount' => $amount, 'note' => $comment,
            'op_type' => 'a', 'dra_type' => $toDrawer));
        if ($result1 && $result2) {
            $this->response($result1, 200);
            exit;
        }
    }
    

    public function getMobileDetailsDay_get()
    {
        $day = $this->get('day');
        $type = "M";
        $result = $this->drawer_model->getDetailsDay($day, $type);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function getAccDetailsDay_get()
    {
        $day = $this->get('day');
        $type = "A";
        $result = $this->drawer_model->getDetailsDay($day, $type);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function getInternetDetailsDay_get()
    {
        $day = $this->get('day');
        $type = "S";
        $result = $this->drawer_model->getDetailsDay($day, $type);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function getOmtDrawerDetails_get()
    {
        $day = $this->get('day');
        $type = "O";
        $result = $this->drawer_model->getDetailsDay($day, $type);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    

}
