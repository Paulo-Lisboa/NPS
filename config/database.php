<?php
// Configuração do banco de dados HostGator
// ALTERE ESTAS INFORMAÇÕES COM OS DADOS DO SEU CPANEL

$host = 'localhost';  // Geralmente é localhost no HostGator
$dbname = 'seu_usuario_nps_system';  // Formato: cpanel_usuario_nomedobanco
$username = 'seu_usuario_mysql';     // Seu usuário MySQL do cPanel
$password = 'sua_senha_mysql';       // Sua senha MySQL do cPanel

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Erro de conexão: " . $e->getMessage());
}
?>
