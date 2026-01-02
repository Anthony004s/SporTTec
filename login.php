<?php
    //mudando para o site principal e rodando o código por "trás"
    
    require "Funcionalidades.php";
    session_start();
    //Código de conexão
    include_once "conexao.php";


    //Recebendo os valores de entrada
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        
        //RECEBENDO OS VALORES
        $email = isset($_POST["email"])?trim($_POST["email"]):"erro";
        $senha = isset($_POST["password"])? $_POST["password"] : "erro";
        $tipoUser = $_POST["user_type"];


        var_dump($tipoUser);
        if($tipoUser == "user")
        {
            //verificando se a senha está correta
            $execSql = $conexao->prepare("SELECT SENHA FROM USUARIO WHERE EMAIL = :email ");
            $execSql -> bindParam(":email",$email);
            $execSql -> execute();

            $dados = $execSql->fetch(PDO::FETCH_ASSOC);

            if(password_verify($senha, $dados["SENHA"]))
            {
                $_SESSION["logado"] = true;
                $_SESSION["email"] = $email;
                $_SESSION["tipo_user"] = "user";
                header("Location: ../html/login.html?login=true");
            }
            else
            {
                header("Location: ../html/login.html?login=false");
            }
        }
        else if($tipoUser == "institution")
        {
            //verificando se a senha está correta
            $execSql = $conexao->prepare("SELECT SENHA FROM INSTITUICAO WHERE EMAIL = :email ");
            $execSql -> bindParam(":email",$email);
            $execSql -> execute();

            $dados = $execSql->fetch(PDO::FETCH_ASSOC);

            if(password_verify($senha, $dados["SENHA"]))
            {
                $_SESSION["logado"] = true;
                $_SESSION["email"] = $email;
                $_SESSION["tipo_user"] = "institution";
                header("Location: ../html/login.html?login=true");
            }
            else
            {
                header("Location: ../html/login.html?login=false");
            }
        }
    }

?>