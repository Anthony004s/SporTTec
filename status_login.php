<?php
    session_start();
    $resul = [
        "logado" => isset($_SESSION["logado"])?$_SESSION["logado"]:false,
        "email" => isset($_SESSION["email"])?$_SESSION["email"]:null,
        "tipo_user" => isset($_SESSION["tipo_user"])?$_SESSION["tipo_user"]:null
    ];

    header('Content-Type: application/json');
    echo json_encode($resul);

?>
