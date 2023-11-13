<?php

    header('content-type:text/html;charset="utf-8"');

    //获取type
    $type = $_GET["type"];
    require '../php/uses/connectdb.php';

    //执行查找
    $sql = "SELECT * FROM poi WHERE type='$type'";
    $res = $conn->query($sql);
    $data = array();
    while($row = $res->fetch_assoc()){
        array_push($data, $row);
    }
    $conn->close();

    if($data){
      exit(json_encode(array(
        "code" => '200',
        "msg" => 'success',
        "data" => $data,
      )));
    } else {
      exit(json_encode(array(
        "code" => '400',
        "msg" => 'noRecord',
      )));
    }
    

?>