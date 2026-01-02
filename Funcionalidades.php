<?php

    class Funcionalidades
    {
        public static function caixaMenssagem($texto,$titulo,$icone)
        {
            echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';
            echo "<script>
            Swal.fire({
                icon: '$icone',
                title: '$titulo',
                text: '$texto'
            });
            </script>";
        }
        //Funções para verificar se há mais de um usuário
        public static function usuarioCadastrado($pdo,$valor):bool
        {
            $stmt = $pdo->prepare("SELECT 1 FROM usuario WHERE cpf = :cpf LIMIT 1");
            $stmt->bindParam(":cpf",$valor);
            $stmt->execute();

            return (bool) $stmt->fetch();
        }
        public static function instituicaoCadastrada($pdo,$valor):bool
        {
            $stmt = $pdo->prepare("SELECT 1 FROM instituicao WHERE cnpj = :cnpj LIMIT 1");
            $stmt->bindParam(":cnpj",$valor);
            $stmt->execute();

            return (bool) $stmt->fetch();
        }
    }



?>