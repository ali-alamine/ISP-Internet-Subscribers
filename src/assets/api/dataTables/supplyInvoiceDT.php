<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(SDID) as exp FROM supply_detail"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if ($orderBy == 'ID') {
        $orderBy = 'SDID';
    }
    if ($orderBy == 'invDate') {
        $orderBy = 'sup_date';
    }
    if ($orderBy == 'totalCost') {
        $orderBy = 'total_cost';
    }
    if ($orderBy == 'drawer') {
        $orderBy = 'invoice_drawer';
    }
    if ($orderBy == 'type') {
        $orderBy = 'invoice_type';
    }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = "select * from supply_detail inner join person on supply_detail.PID = person.PID where name like '%" . $search . "%' OR sup_date like '%" . $search . "%' OR invoice_type like '%" . $search . "%' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = "SELECT * from supply_detail inner join person on supply_detail.PID = person.PID " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['SDID'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"rest":"' . $row['rest'] . '",';
            $jsonData = $jsonData . '"PID":"' . $row['PID'] . '",';
            $jsonData = $jsonData . '"invDate":"' . $row['sup_date'] . '",';
            $jsonData = $jsonData . '"type":"' . $row['invoice_type'] . '",';
            $jsonData = $jsonData . '"drawer":"' . $row['invoice_drawer'] . '",';
            $jsonData = $jsonData . '"totalCost":"' . $row['total_cost'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
