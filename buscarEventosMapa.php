<?php
//Código para busca de eventos
include_once "conexao.php";

header('Content-Type: application/json; charset=utf-8');

try {
    
    $execSql = $conexao->query("
        SELECT 
            e.ideventos as id,
            e.nome,
            e.esporte,
            e.local,
            e.cidade,
            e.data,
            e.horario,
            e.numerovagas as participantes,
            e.dificuldade,
            e.valorinscricao as valor,
            e.latitude,
            e.longitude
        FROM eventos e 
        WHERE e.data >= CURDATE() 
        ORDER BY e.data ASC
    ");
    
    $eventos = $execSql->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'eventos' => $eventos
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao buscar eventos: ' . $e->getMessage()
    ]);
}
?>