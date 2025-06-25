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
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
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
    case 'PUT':
        handlePut($pdo, $endpoint, $id);
        break;
    case 'DELETE':
        handleDelete($pdo, $endpoint, $id);
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
                    // Get single post by slug or ID
                    $stmt = $pdo->prepare("
                        SELECT p.*, a.name as authorName, a.email as authorEmail, 
                               c.name as categoryName, c.slug as categorySlug,
                               COUNT(pv.id) as views
                        FROM post p 
                        LEFT JOIN author a ON p.authorId = a.id
                        LEFT JOIN category c ON p.categoryId = c.id  
                        LEFT JOIN postview pv ON p.id = pv.postId
                        WHERE p.slug = ? OR p.id = ?
                        GROUP BY p.id
                    ");
                    $stmt->execute([$id, $id]);
                    echo json_encode($stmt->fetch());
                } else {
                    // Get all posts with pagination
                    $page = $_GET['page'] ?? 1;
                    $limit = $_GET['limit'] ?? 10;
                    $offset = ($page - 1) * $limit;
                    
                    $stmt = $pdo->prepare("
                        SELECT p.*, a.name as authorName, c.name as categoryName,
                               COUNT(pv.id) as views
                        FROM post p 
                        LEFT JOIN author a ON p.authorId = a.id
                        LEFT JOIN category c ON p.categoryId = c.id
                        LEFT JOIN postview pv ON p.id = pv.postId
                        WHERE p.published = 1 
                        GROUP BY p.id
                        ORDER BY p.createdAt DESC 
                        LIMIT ? OFFSET ?
                    ");
                    $stmt->execute([$limit, $offset]);
                    echo json_encode($stmt->fetchAll());
                }
                break;

            case 'portfolio':
                if ($id) {
                    // Get single portfolio by slug or ID
                    $stmt = $pdo->prepare("
                        SELECT p.*, pc.name as categoryName, pc.icon as categoryIcon
                        FROM portfolio p 
                        LEFT JOIN portfoliocategory pc ON p.categoryId = pc.id
                        WHERE p.slug = ? OR p.id = ?
                    ");
                    $stmt->execute([$id, $id]);
                    echo json_encode($stmt->fetch());
                } else {
                    // Get all portfolio items
                    $stmt = $pdo->query("
                        SELECT p.*, pc.name as categoryName, pc.icon as categoryIcon
                        FROM portfolio p 
                        LEFT JOIN portfoliocategory pc ON p.categoryId = pc.id
                        WHERE p.published = 1 
                        ORDER BY p.createdAt DESC
                    ");
                    echo json_encode($stmt->fetchAll());
                }
                break;

            case 'categories':
                $stmt = $pdo->query("SELECT * FROM category ORDER BY name ASC");
                echo json_encode($stmt->fetchAll());
                break;

            case 'portfolio-categories':
                $stmt = $pdo->query("SELECT * FROM portfoliocategory ORDER BY name ASC");
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
                $stmt = $pdo->query("SELECT * FROM setting");
                $settings = [];
                while ($row = $stmt->fetch()) {
                    $settings[$row['key']] = $row['value'];
                }
                echo json_encode($settings);
                break;

            case 'stats':
                $stats = [];
                
                // Total posts
                $stmt = $pdo->query("SELECT COUNT(*) as count FROM post WHERE published = 1");
                $stats['totalPosts'] = $stmt->fetch()['count'];
                
                // Total portfolio
                $stmt = $pdo->query("SELECT COUNT(*) as count FROM portfolio WHERE published = 1");
                $stats['totalPortfolio'] = $stmt->fetch()['count'];
                
                // Total views
                $stmt = $pdo->query("SELECT COUNT(*) as count FROM postview");
                $stats['totalViews'] = $stmt->fetch()['count'];
                
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
            case 'posts':
                $stmt = $pdo->prepare("
                    INSERT INTO post (title, content, excerpt, slug, featuredImage, authorId, categoryId, published, featured, createdAt) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ");
                $stmt->execute([
                    $data['title'], $data['content'], $data['excerpt'], $data['slug'],
                    $data['featuredImage'], $data['authorId'], $data['categoryId'], 
                    $data['published'], $data['featured']
                ]);
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;

            case 'portfolio':
                $stmt = $pdo->prepare("
                    INSERT INTO portfolio (title, description, content, slug, featuredImage, clientName, 
                                         projectUrl, githubUrl, categoryId, published, featured, createdAt) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ");
                $stmt->execute([
                    $data['title'], $data['description'], $data['content'], $data['slug'],
                    $data['featuredImage'], $data['clientName'], $data['projectUrl'],
                    $data['githubUrl'], $data['categoryId'], $data['published'], $data['featured']
                ]);
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;

            case 'post-view':
                // Track post view
                $stmt = $pdo->prepare("INSERT INTO postview (postId, ipAddress, createdAt) VALUES (?, ?, NOW())");
                $stmt->execute([$data['postId'], $_SERVER['REMOTE_ADDR'] ?? 'unknown']);
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

function handlePut($pdo, $endpoint, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        switch ($endpoint) {
            case 'posts':
                $stmt = $pdo->prepare("
                    UPDATE post SET title = ?, content = ?, excerpt = ?, slug = ?, 
                           featuredImage = ?, categoryId = ?, published = ?, featured = ?, updatedAt = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([
                    $data['title'], $data['content'], $data['excerpt'], $data['slug'],
                    $data['featuredImage'], $data['categoryId'], $data['published'], 
                    $data['featured'], $id
                ]);
                echo json_encode(['success' => true]);
                break;

            case 'portfolio':
                $stmt = $pdo->prepare("
                    UPDATE portfolio SET title = ?, description = ?, content = ?, slug = ?,
                           featuredImage = ?, clientName = ?, projectUrl = ?, githubUrl = ?,
                           categoryId = ?, published = ?, featured = ?, updatedAt = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([
                    $data['title'], $data['description'], $data['content'], $data['slug'],
                    $data['featuredImage'], $data['clientName'], $data['projectUrl'],
                    $data['githubUrl'], $data['categoryId'], $data['published'], 
                    $data['featured'], $id
                ]);
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

function handleDelete($pdo, $endpoint, $id) {
    try {
        switch ($endpoint) {
            case 'posts':
                // Delete related data first
                $pdo->prepare("DELETE FROM postview WHERE postId = ?")->execute([$id]);
                $pdo->prepare("DELETE FROM posttags WHERE postId = ?")->execute([$id]);
                $pdo->prepare("DELETE FROM post WHERE id = ?")->execute([$id]);
                echo json_encode(['success' => true]);
                break;

            case 'portfolio':
                // Delete related data first  
                $pdo->prepare("DELETE FROM portfoliotags WHERE portfolioId = ?")->execute([$id]);
                $pdo->prepare("DELETE FROM portfolio WHERE id = ?")->execute([$id]);
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