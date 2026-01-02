<?php 

    try {
        $conexao = new PDO("mysql:host=localhost;dbname=SPORTTECH","root","");
        //Configurando para o pdo lançar exceções em caso de erros
        $conexao -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //mudando para UTF-8
        $conexao -> exec("set names utf8");


    } catch (PDOException $error) {
        echo "Erro: ". $error->getMessage(); 
    }

?>