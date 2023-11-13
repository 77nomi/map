<?php 
    $conn = new mysqli("localhost", "root", "123456", "map", 3306);

    $conn->set_charset("utf8");
    
    // 检测连接
    if ($conn->connect_error) {
        $responddata['code'] = 400;
        $responddata['msg'] = "数据库链接失败";
        echo json_encode($responddata);
        exit;
    }
?>