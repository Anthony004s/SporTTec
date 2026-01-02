<?php
    //mudando para o site principal e rodando o código por "trás"
    header("Location: ../html/login.html");
    //uSANDO A CLASSSE FUNCIONALIDADES
    require "Funcionalidades.php";
    session_start();
    //Código da conexão
    include_once "conexao.php";

    //Verificando se foi enviado
    if($_SERVER["REQUEST_METHOD"] == "POST")
    {
        //Recebendo os valores
        $razaosocial = isset($_POST["razaosocial"]) ? trim($_POST["razaosocial"]) : "erro";
        $email = isset($_POST["email"]) ? trim($_POST["email"]) : "erro";
        $cnpj = isset($_POST["cnpj"]) ? trim($_POST["cnpj"]) : "erro";
        $tel = isset($_POST["telefone"]) ? trim($_POST["telefone"]) : "erro";
        $esporte = isset($_POST["esporte"]) ? trim($_POST["esporte"]) : "erro";
        $senha = isset($_POST["password"]) ? $_POST["password"]:"erro";

        //Colocando segurança na senha
        $senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);

        //Consultando se esse usuário já exite usando o CPF como chave
        if(Funcionalidades::instituicaoCadastrada($conexao,$cnpj))
        {
            header("Location: ../html/login.html?cadastrado=true");
        }
        //Agora está recebendo os valores do usuário, quando não exitir

        $execSql = $conexao->prepare("
        INSERT INTO INSTITUICAO (RAZAOSOCIAL,EMAIL,ESPORTE,TELEFONE,CNPJ,SENHA) VALUES (:razaosocial,:email, :esporte
        ,:telefone,:cnpj,:senha);");


        $execSql->bindParam(":razaosocial",$razaosocial);
        $execSql->bindParam(":email",$email);
        $execSql->bindParam(":esporte",$esporte);
        $execSql->bindParam(":telefone",$tel);
        $execSql->bindParam(":cnpj",$cnpj);
        $execSql->bindParam(":senha",$senhaCriptografada);

        $execSql->execute();
    }
?>