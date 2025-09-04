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
    case 'submit':
        submitResponse();
        break;
    case 'list':
        listResponses();
        break;
    case 'analytics':
        getAnalytics();
        break;
    default:
        echo json_encode(['error' => 'Ação inválida']);
}

function submitResponse() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $survey_id = $input['survey_id'] ?? '';
    $score = $input['score'] ?? '';
    $comment = $input['comment'] ?? '';
    $customer_name = $input['customer_name'] ?? '';
    $customer_email = $input['customer_email'] ?? '';
    $channel = $input['channel'] ?? 'web';
    
    $stmt = $pdo->prepare("INSERT INTO nps_responses (survey_id, score, comment, customer_name, customer_email, channel) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$survey_id, $score, $comment, $customer_name, $customer_email, $channel]);
    
    echo json_encode(['success' => true, 'message' => 'Resposta enviada com sucesso!']);
}

function listResponses() {
    global $pdo;
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Não autenticado']);
        return;
    }
    
    $stmt = $pdo->prepare("
        SELECT r.*, s.title as survey_title 
        FROM nps_responses r 
        JOIN nps_surveys s ON r.survey_id = s.id 
        WHERE s.company_id = ? 
        ORDER BY r.created_at DESC
    ");
    $stmt->execute([$_SESSION['company_id']]);
    $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['responses' => $responses]);
}

function getAnalytics() {
    global $pdo;
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Não autenticado']);
        return;
    }
    
    // Calcular NPS
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN score >= 9 THEN 1 ELSE 0 END) as promoters,
            SUM(CASE WHEN score >= 7 AND score <= 8 THEN 1 ELSE 0 END) as passives,
            SUM(CASE WHEN score <= 6 THEN 1 ELSE 0 END) as detractors
        FROM nps_responses r 
        JOIN nps_surveys s ON r.survey_id = s.id 
        WHERE s.company_id = ?
    ");
    $stmt->execute([$_SESSION['company_id']]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $nps_score = 0;
    if ($stats['total'] > 0) {
        $promoter_percentage = ($stats['promoters'] / $stats['total']) * 100;
        $detractor_percentage = ($stats['detractors'] / $stats['total']) * 100;
        $nps_score = round($promoter_percentage - $detractor_percentage);
    }
    
    echo json_encode([
        'nps_score' => $nps_score,
        'total_responses' => $stats['total'],
        'promoters' => $stats['promoters'],
        'passives' => $stats['passives'],
        'detractors' => $stats['detractors']
    ]);
}
?>
