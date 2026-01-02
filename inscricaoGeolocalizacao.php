<?php
    //Criando a conexão
    session_start();
    include_once "conexao.php";
    
    if($_SESSION['tipo_user'] == "institution" || $_SESSION['tipo_user'] == null)
    {
        header("Location: ../html/index.html?tipo_user=institution");
    }


    //PEGANDO O ID DO ATLETA E DO EVENTO
    //Pegando o id do usuário
    $execSql = $conexao->prepare("SELECT IDUSUARIO FROM USUARIO WHERE EMAIL = :email");
    $execSql->bindParam(":email", $_SESSION['email']);
    $execSql->execute();

    $idAtleta = $execSql->fetch(PDO::FETCH_ASSOC);
    $idEvento = isset($_POST['idevento'])?$_POST['idevento']:"erro";
    var_dump($idAtleta);
    var_dump($idEvento);

    echo " </BR>Id Atleta -> " . $idAtleta['IDUSUARIO'];
    echo "</br> Evento -> " . $idEvento;


    $execSql = $conexao->prepare("SELECT COUNT(*) FROM usuario_evento WHERE usuario_id = :user AND evento_id = :evento");
    $execSql -> bindParam(":user",$idAtleta['IDUSUARIO']);
    $execSql -> bindParam(":evento",$idEvento);
    try{
        $execSql->execute();
    }
    catch(PDOException $erro)
    {
        echo "" + $erro->getMessage();
    }


    if($execSql->fetchColumn() > 0)
    {
        echo "Usuário já inscrito";
        header("Location: ../html/geolocalizacao.html?jainscrito=true");
    }
    else
    {
        $execSql = $conexao->prepare("INSERT INTO USUARIO_EVENTO (usuario_id, evento_id) VALUES (:atleta, :evento);");
        $execSql->bindParam(":atleta",$idAtleta['IDUSUARIO']);
        $execSql->bindParam(":evento",$idEvento);
        $execSql-> execute();
        header("Location: ../html/geolocalizacao.html?inscrito=true");
    }
    
?>