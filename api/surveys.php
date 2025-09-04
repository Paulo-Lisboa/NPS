<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$action = $_GET['action'] ?? '';

switch($action) {
    case 'create':
        createSurvey();
        break;
    case 'list':
        listSurveys();
        break;
    case 'get':
        getSurvey();
        break;
    default:
        echo json_encode(['error' => 'Ação inválida']);
}

function createSurvey() {
    global $pdo;
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Não autenticado']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $title = $input['title'] ?? '';
    $description = $input['description'] ?? '';
    
    $stmt = $pdo->prepare("INSERT INTO nps_surveys (company_id, title, description) VALUES (?, ?, ?)");
    $stmt->execute([$_SESSION['company_id'], $title, $description]);
    
    $survey_id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'survey_id' => $survey_id,
        'link' => "https://certtech.com.br/nps/survey.php?id=$survey_id"
    ]);
}

function listSurveys() {
    global $pdo;
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Não autenticado']);
        return;
    }
    
    $stmt = $pdo->prepare("SELECT * FROM nps_surveys WHERE company_id = ? ORDER BY created_at DESC");
    $stmt->execute([$_SESSION['company_id']]);
    $surveys = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['surveys' => $surveys]);
}

function getSurvey() {
    global $pdo;
    
    $survey_id = $_GET['id'] ?? '';
    
    $stmt = $pdo->prepare("SELECT * FROM nps_surveys WHERE id = ? AND active = 1");
    $stmt->execute([$survey_id]);
    $survey = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($survey) {
        echo json_encode(['survey' => $survey]);
    } else {
        echo json_encode(['error' => 'Pesquisa não encontrada']);
    }
}
?>
