<?php
    //código de conexão
    include_once "conexao.php";
    session_start();

    
    function geocodificarEndereco($endereco, $cidade) {
        $enderecoCompleto = urlencode($endereco . ', ' . $cidade . ', São Paulo, Brasil');
        
        
        $url = "https://nominatim.openstreetmap.org/search?format=json&q={$enderecoCompleto}&limit=1";
        
        $context = stream_context_create([
            'http' => [
                'header' => "User-Agent: SporTTech/1.0\r\n"
            ]
        ]);
        
        $response = file_get_contents($url, false, $context);
        $data = json_decode($response, true);
        
        if (!empty($data)) {
            return [
                'latitude' => $data[0]['lat'],
                'longitude' => $data[0]['lon']
            ];
        }
        
        return null;
    }
    
    //VERIFICANDO SE FOI ENVIADO
    if($_SERVER["REQUEST_METHOD"] == "POST")
    {
        //Pegando as informações
        $nomeEvento = isset($_POST["nome"])?trim($_POST["nome"]):"erro";
        $esporte = isset($_POST["esporte"])?$_POST["esporte"]:"erro";
        $desc = isset($_POST["descricao"])?trim($_POST["descricao"]):"erro";
        $data = isset($_POST["data"])?$_POST["data"]:"erro";
        $enderecoCompleto  = isset($_POST["endereco"])?trim($_POST["endereco"]):"erro";
        $horario = isset($_POST["hora"])?$_POST["hora"]:"erro";
        $local = isset($_POST["local"])?trim($_POST["local"]):"erro";
        $cidade = isset($_POST["cidade"])?trim($_POST["cidade"]):"erro";
        $numVagas = isset($_POST["vagas"])?$_POST["vagas"]:"erro";
        $categoria = isset($_POST["categoria"])?$_POST["categoria"]:"erro";
        $dificuldade = isset($_POST["dificuldade"])?$_POST["dificuldade"]:"erro";
        $valor = isset($_POST["valor"])?$_POST["valor"]:"erro";
        $organizadorNome = isset($_POST["organizador_nome"])?$_POST["organizador_nome"]:"erro";
        $organizadorTelefone = isset($_POST["organizador_telefone"])?$_POST["organizador_telefone"]:"erro";
        $organizadorEmail = isset($_POST["organizador_email"])?$_POST["organizador_email"]:"erro";

        $coordenadas = geocodificarEndereco($enderecoCompleto, $cidade);
        
        $latitude = null;
        $longitude = null;
        
        if ($coordenadas) {
            $latitude = $coordenadas['latitude'];
            $longitude = $coordenadas['longitude'];
        }

        $execSql = $conexao->prepare("INSERT INTO EVENTOS (NOME, CATEGORIA, ESPORTE, EMAIL, TELEFONE, DATA,
        DESCRICAO, LOCAL, HORARIO, VALORINSCRICAO, NUMEROVAGAS, DIFICULDADE, ENDERECOCOMPLETO, CIDADE, LATITUDE, LONGITUDE) 
        VALUES (:nome, :categoria, :esporte, :email, :telefone, :data, :descricao, :local, :horario, :valorinscricao, :numerovagas
        , :dificuldade, :enderecocompleto, :cidade, :latitude, :longitude);");


        $execSql->bindParam(":nome",$nomeEvento);
        $execSql->bindParam(":categoria",$categoria);
        $execSql->bindParam(":esporte",$esporte);
        $execSql->bindParam(":email",$organizadorEmail);
        $execSql->bindParam(":telefone",$organizadorTelefone);
        $execSql->bindParam(":data",$data);
        $execSql->bindParam(":descricao",$desc);
        $execSql->bindParam(":local",$local);
        $execSql->bindParam(":horario",$horario);
        $execSql->bindParam(":valorinscricao",$valor);
        $execSql->bindParam(":numerovagas",$numVagas);
        $execSql->bindParam(":dificuldade",$dificuldade);
        $execSql->bindParam(":enderecocompleto",$enderecoCompleto);
        $execSql->bindParam(":cidade",$cidade);
        $execSql->bindParam(":latitude",$latitude);
        $execSql->bindParam(":longitude",$longitude);
        $execSql->execute();

        header("Location: ../html/todos.html");
    }


?>