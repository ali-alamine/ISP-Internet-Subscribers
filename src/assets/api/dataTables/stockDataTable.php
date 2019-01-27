<?php
include './connection.php';
openConn();
$type=$_GET["type"];
$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";
$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(IID) as exp FROM item"))['exp'];
if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if($orderBy=='ID')
        $orderBy='IID';
    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
} 
//select accessories
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];
    if( $type=="AC")
        $getAllFactureQuery = "SELECT * FROM accessories as acc INNER JOIN item on item.IID = acc.IID where item.type='".$type."' and ( item.name like '%" . $search . "%' ) ". $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    if($type=="RC")
        $getAllFactureQuery = "SELECT * FROM recharge_card as rc INNER JOIN item on item.IID = rc.IID where item.type='".$type."' and ( item.name like '%" . $search . "%' ) ". $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    if($type=="OF")
        $getAllFactureQuery = "SELECT * FROM offers as of INNER JOIN item on item.IID = of.IID where ( item.type='".$type."' OR item.type='CT') and ( item.name like '%" . $search . "%' ) ". $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    if($type=="CT")
        $getAllFactureQuery = "SELECT * FROM credit as cr INNER JOIN item on item.IID = cr.IID where item.type='".$type."' and ( item.name like '%" . $search . "%' ) ". $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

    } else {
    if( $type=="AC")
        $getAllFactureQuery = " SELECT * FROM accessories as acc INNER JOIN item on item.IID = acc.IID where item.type='".$type."' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    if($type=="RC")
        $getAllFactureQuery = " SELECT * FROM recharge_card as rc INNER JOIN item on item.IID = rc.IID where item.type='".$type."' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    if($type=="OF")
        $getAllFactureQuery = " SELECT * FROM offers as of INNER JOIN item on item.IID = of.IID where  ( item.type='".$type."' OR item.type='CT') " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    if($type=="CT")
        $getAllFactureQuery = " SELECT * FROM credit as cr INNER JOIN item on item.IID = cr.IID where item.type='".$type."' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}
$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null && $type =="AC") {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['IID'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"quantity":"' . $row['quantity'] . '",';
            $jsonData = $jsonData . '"cost":"' . $row['cost'] . '",';
            $jsonData = $jsonData . '"price":"' . $row['price'] . '",';
            $jsonData = $jsonData . '"bar_code":"' . $row['bar_code'] . '"}';
        } 
        if ($row != null && $type =="RC") {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['IID'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"company":"' . $row['company'] . '",';
            $jsonData = $jsonData . '"quantity":"' . $row['quantity'] . '",';
            $jsonData = $jsonData . '"cost":"' . $row['cost'] . '",';
            $jsonData = $jsonData . '"price":"' . $row['price'] . '",';
            $jsonData = $jsonData . '"bar_code":"' . $row['bar_code'] . '"}';
        }
        if ($row != null && $type =="OF") {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['IID'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"company":"' . $row['company'] . '",';
            $jsonData = $jsonData . '"num_of_mounth":"' . $row['num_of_mounth'] . '",';
            $jsonData = $jsonData . '"num_of_credit":"' . $row['num_of_credit'] . '",';
            $jsonData = $jsonData . '"price":"' . $row['price'] . '",';
            $jsonData = $jsonData . '"bar_code":"' . $row['bar_code'] . '"}';
        } 
        if($row != null && $type =="CT"){
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['IID'] . '",';
            $jsonData = $jsonData . '"credits":"' . $row['credits'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
