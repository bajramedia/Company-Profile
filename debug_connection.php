<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database configuration  
$host = 'localhost';
$dbname = 'bajx7634_bajra';
$username = 'bajx7634_bajra'; 
$password = 'bajra@media@com';

$response = [];

// Test 1: Database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $response['database_connection'] = 'SUCCESS';
    
    // Test 2: Check if tables exist
    $tables = ['post', 'category', 'author', 'portfolio'];
    $response['tables'] = [];
    
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            $count = $stmt->fetch()['count'];
            $response['tables'][$table] = "EXISTS ($count records)";
        } catch (Exception $e) {
            $response['tables'][$table] = "ERROR: " . $e->getMessage();
        }
    }
    
    // Test 3: Sample data
    try {
        $stmt = $pdo->query("SELECT * FROM category LIMIT 3");
        $response['sample_categories'] = $stmt->fetchAll();
    } catch (Exception $e) {
        $response['sample_categories_error'] = $e->getMessage();
    }
    
    try {
        $stmt = $pdo->query("SELECT id, title, slug, published FROM post LIMIT 3");
        $response['sample_posts'] = $stmt->fetchAll();
    } catch (Exception $e) {
        $response['sample_posts_error'] = $e->getMessage();
    }
    
} catch (PDOException $e) {
    $response['database_connection'] = 'FAILED';
    $response['error'] = $e->getMessage();
}

$response['timestamp'] = date('Y-m-d H:i:s');
$response['server_info'] = [
    'PHP_VERSION' => PHP_VERSION,
    'SERVER_SOFTWARE' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
];

echo json_encode($response, JSON_PRETTY_PRINT);
?> 