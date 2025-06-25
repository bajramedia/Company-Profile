<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Database configuration
$host = 'localhost';
$dbname = 'bajx7634_bajra';
$username = 'bajx7634_bajra';
$password = 'bajra@media@com';

// Initialize database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? '';
$id = $_GET['id'] ?? null;

// Route requests
switch ($method) {
    case 'GET':
        handleGet($pdo, $endpoint, $id);
        break;
    case 'POST':
        handlePost($pdo, $endpoint);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function handleGet($pdo, $endpoint, $id) {
    try {
        switch ($endpoint) {
            case 'posts':
                if ($id) {
                    // Get single post by slug - using CORRECT column names
                    $stmt = $pdo->prepare("
                        SELECT p.*, 
                               p.date as createdAt,
                               a.name as authorName, 
                               a.email as authorEmail,
                               a.avatar as authorAvatar,
                               c.name as categoryName,
                               c.slug as categorySlug
                        FROM post p 
                        LEFT JOIN author a ON p.authorId = a.id
                        LEFT JOIN category c ON p.categoryId = c.id  
                        WHERE (p.slug = ? OR p.id = ?) AND p.published = 1
                    ");
                    $stmt->execute([$id, $id]);
                    echo json_encode($stmt->fetch());
                } else {
                    // Get all posts - using CORRECT column names
                    $page = max(1, intval($_GET['page'] ?? 1));
                    $limit = max(1, min(100, intval($_GET['limit'] ?? 10)));
                    $offset = ($page - 1) * $limit;
                    
                    $sql = "
                        SELECT p.*, 
                               p.date as createdAt,
                               a.name as authorName, 
                               a.email as authorEmail,
                               a.avatar as authorAvatar,
                               c.name as categoryName,
                               c.slug as categorySlug
                        FROM post p 
                        LEFT JOIN author a ON p.authorId = a.id
                        LEFT JOIN category c ON p.categoryId = c.id
                        WHERE p.published = 1 
                        ORDER BY p.date DESC 
                        LIMIT {$limit} OFFSET {$offset}
                    ";
                    $stmt = $pdo->query($sql);
                    echo json_encode($stmt->fetchAll());
                }
                break;

            case 'portfolio':
                $stmt = $pdo->query("
                    SELECT p.*, 
                           p.date as createdAt,
                           pc.name as categoryName, 
                           pc.icon as categoryIcon
                    FROM portfolio p 
                    LEFT JOIN portfoliocategory pc ON p.categoryId = pc.id
                    WHERE p.published = 1 
                    ORDER BY p.date DESC
                ");
                echo json_encode($stmt->fetchAll());
                break;

            case 'categories':
                $stmt = $pdo->query("SELECT * FROM category ORDER BY name ASC");
                echo json_encode($stmt->fetchAll());
                break;

            case 'authors':
                $stmt = $pdo->query("SELECT * FROM author ORDER BY name ASC");
                echo json_encode($stmt->fetchAll());
                break;

            case 'tags':
                $stmt = $pdo->query("SELECT * FROM tag ORDER BY name ASC");
                echo json_encode($stmt->fetchAll());
                break;

            case 'portfolio-tags':
                $stmt = $pdo->query("SELECT * FROM portfoliotag ORDER BY name ASC");
                echo json_encode($stmt->fetchAll());
                break;

            case 'settings':
                try {
                    $stmt = $pdo->query("SELECT * FROM setting");
                    $settings = [];
                    while ($row = $stmt->fetch()) {
                        $settings[$row['key']] = $row['value'];
                    }
                    echo json_encode($settings);
                } catch (Exception $e) {
                    echo json_encode([]);
                }
                break;

            case 'stats':
                $stats = [];
                
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM post WHERE published = 1");
                    $stats['totalPosts'] = $stmt->fetch()['count'];
                } catch (Exception $e) {
                    $stats['totalPosts'] = 0;
                }
                
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM portfolio WHERE published = 1");
                    $stats['totalPortfolio'] = $stmt->fetch()['count'];
                } catch (Exception $e) {
                    $stats['totalPortfolio'] = 0;
                }
                
                try {
                    // Sum all views from post table
                    $stmt = $pdo->query("SELECT SUM(views) as total FROM post WHERE published = 1");
                    $result = $stmt->fetch();
                    $stats['totalViews'] = $result['total'] ?? 0;
                } catch (Exception $e) {
                    $stats['totalViews'] = 0;
                }
                
                echo json_encode($stats);
                break;

            default:
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function handlePost($pdo, $endpoint) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        switch ($endpoint) {
            case 'post-view':
                // Update views directly in post table
                $stmt = $pdo->prepare("UPDATE post SET views = views + 1 WHERE id = ?");
                $stmt->execute([$data['postId']]);
                echo json_encode(['success' => true]);
                break;

            default:
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?> 