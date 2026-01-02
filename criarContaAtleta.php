<?php
    //mudando para o site principal e rodando o código por "trás"
    header("Location: ../html/login.html");
    require "Funcionalidades.php";
    include_once "conexao.php";

    session_start();


    //Verificando se foi enviado
    if($_SERVER["REQUEST_METHOD"] == "POST")
    {
        //Recebendo os valores
        $nome = isset($_POST["nome"]) ? trim($_POST["nome"]) : "erro";
        $email = isset($_POST["email"]) ? trim($_POST["email"]) : "erro";
        $cpf = isset($_POST["cpf"]) ? trim($_POST["cpf"]) : "erro";
        $tel = isset($_POST["telefone"]) ? trim($_POST["telefone"]) : "erro";
        $dataNasc = isset($_POST["dataNasc"]) ? trim($_POST["dataNasc"]) : "erro";
        $sexo = isset($_POST["sexo"]) ? trim($_POST["sexo"]) : "erro";
        $senha = isset($_POST["password"]) ? $_POST["password"]:"erro";

        //Colocando segurança na senha
        $senhaCriptograda = password_hash($senha, PASSWORD_DEFAULT);

        //Consultando se esse usuário já exite usando o CPF como chave
        if(Funcionalidades::usuarioCadastrado($conexao,$cpf))
        {
            header("Location: ../html/login.html?cadastrado=true");

        }
        //Agora está recebendo os valores do usuário, quando não exitir

        $execSql = $conexao->prepare("
        INSERT INTO USUARIO (NOME,EMAIL,SEXO,TELEFONE,DATANASC,CPF,SENHA) VALUES (:nome,:email,:sexo,
        :telefone,:dataNasc,:cpf,:senha);
        ");


        $execSql->bindParam(":nome",$nome);
        $execSql->bindParam(":email",$email);
        $execSql->bindParam(":sexo",$sexo);
        $execSql->bindParam(":telefone",$tel);
        $execSql->bindParam(":dataNasc",$dataNasc);
        $execSql->bindParam(":cpf",$cpf);
        $execSql->bindParam(":senha",$senhaCriptograda);

        $execSql->execute();
        header("Location: ../html/login.html");
    }
?>