<?php 
    include_once "../php/conexao.php";
    

    //Pegando as informações do banco
    $execSql = $conexao->query("SELECT * FROM EVENTOS");
    $dados = $execSql->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($dados);   
    

?>