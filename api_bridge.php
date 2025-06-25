<?php
header('Content-Type: application/json');
// Allow specific origins and fallback to *
$allowedOrigins = [
    'https://company-profile-git-main-bajra-media.vercel.app',
    'https://company-profile-c0emzkquv-bajra-media.vercel.app', 
    'https://bajramedia.vercel.app'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');
header('Access-Control-Allow-Credentials: true');

// Debug headers
error_log("API Bridge called: " . $_SERVER['REQUEST_URI']);
error_log("Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? 'none'));
error_log("User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'none'));

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

// Handle endpoint aliases - category should map to categories
if ($endpoint === 'category') {
    $endpoint = 'categories';
}

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

function getTableColumns($pdo, $tableName) {
    try {
        $stmt = $pdo->query("DESCRIBE $tableName");
        $columns = [];
        while ($row = $stmt->fetch()) {
            $columns[] = $row['Field'];
        }
        return $columns;
    } catch (Exception $e) {
        return [];
    }
}

function getDateColumn($columns) {
    // Check for common date column names
    $dateColumns = ['createdAt', 'created_at', 'date_created', 'published_at', 'date', 'created'];
    foreach ($dateColumns as $col) {
        if (in_array($col, $columns)) {
            return $col;
        }
    }
    return 'id'; // fallback to id if no date column found
}

function handleGet($pdo, $endpoint, $id) {
    try {
        switch ($endpoint) {
            case 'posts':
                // Get table columns first
                $postColumns = getTableColumns($pdo, 'post');
                $authorColumns = getTableColumns($pdo, 'author');
                $categoryColumns = getTableColumns($pdo, 'category');
                
                $dateCol = getDateColumn($postColumns);
                $authorNameCol = in_array('name', $authorColumns) ? 'name' : 'author_name';
                $categoryNameCol = in_array('name', $categoryColumns) ? 'name' : 'category_name';
                
                if ($id) {
                    // Get single post by slug
                    $stmt = $pdo->prepare("
                        SELECT p.*, 
                               a.$authorNameCol as authorName, 
                               a.email as authorEmail,
                               c.$categoryNameCol as categoryName,
                               c.slug as categorySlug
                        FROM post p 
                        LEFT JOIN author a ON p.authorId = a.id
                        LEFT JOIN category c ON p.categoryId = c.id  
                        WHERE (p.slug = ? OR p.id = ?) AND p.published = 1
                    ");
                    $stmt->execute([$id, $id]);
                    $result = $stmt->fetch();
                    
                    // Add createdAt field for compatibility
                    if ($result && $dateCol !== 'createdAt') {
                        $result['createdAt'] = $result[$dateCol] ?? date('Y-m-d H:i:s');
                    }
                    
                    echo json_encode($result);
                } else {
                    // Get all posts with proper pagination
                    $page = max(1, intval($_GET['page'] ?? 1));
                    $limit = max(1, min(100, intval($_GET['limit'] ?? 10)));
                    $offset = ($page - 1) * $limit;
                    
                    $sql = "
                        SELECT p.*, 
                               a.$authorNameCol as authorName, 
                               a.email as authorEmail,
                               c.$categoryNameCol as categoryName,
                               c.slug as categorySlug
                        FROM post p 
                        LEFT JOIN author a ON p.authorId = a.id
                        LEFT JOIN category c ON p.categoryId = c.id
                        WHERE p.published = 1 
                        ORDER BY p.$dateCol DESC 
                        LIMIT $limit OFFSET $offset
                    ";
                    $stmt = $pdo->query($sql);
                    $results = $stmt->fetchAll();
                    
                    // Add createdAt field for compatibility
                    foreach ($results as &$result) {
                        if ($dateCol !== 'createdAt') {
                            $result['createdAt'] = $result[$dateCol] ?? date('Y-m-d H:i:s');
                        }
                    }
                    
                    echo json_encode($results);
                }
                break;

            case 'portfolio':
                // Get table columns
                $portfolioColumns = getTableColumns($pdo, 'portfolio');
                $categoryColumns = getTableColumns($pdo, 'portfoliocategory');
                
                $dateCol = getDateColumn($portfolioColumns);
                $categoryNameCol = in_array('name', $categoryColumns) ? 'name' : 'category_name';
                
                if ($id) {
                    // Get single portfolio by slug
                    $stmt = $pdo->prepare("
                        SELECT p.*, pc.$categoryNameCol as categoryName, pc.icon as categoryIcon
                        FROM portfolio p 
                        LEFT JOIN portfoliocategory pc ON p.categoryId = pc.id
                        WHERE (p.slug = ? OR p.id = ?) AND p.published = 1
                    ");
                    $stmt->execute([$id, $id]);
                    $result = $stmt->fetch();
                    
                    if ($result && $dateCol !== 'createdAt') {
                        $result['createdAt'] = $result[$dateCol] ?? date('Y-m-d H:i:s');
                    }
                    
                    echo json_encode($result);
                } else {
                    // Get all portfolio items
                    $sql = "
                        SELECT p.*, pc.$categoryNameCol as categoryName, pc.icon as categoryIcon
                        FROM portfolio p 
                        LEFT JOIN portfoliocategory pc ON p.categoryId = pc.id
                        WHERE p.published = 1 
                        ORDER BY p.$dateCol DESC
                    ";
                    $stmt = $pdo->query($sql);
                    $results = $stmt->fetchAll();
                    
                    foreach ($results as &$result) {
                        if ($dateCol !== 'createdAt') {
                            $result['createdAt'] = $result[$dateCol] ?? date('Y-m-d H:i:s');
                        }
                    }
                    
                    echo json_encode($results);
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
                try {
                    $stmt = $pdo->query("SELECT * FROM setting");
                    $settings = [];
                    while ($row = $stmt->fetch()) {
                        $settings[$row['key']] = $row['value'];
                    }
                    echo json_encode($settings);
                } catch (Exception $e) {
                    // Settings table might not exist
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
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM postview");
                    $stats['totalViews'] = $stmt->fetch()['count'];
                } catch (Exception $e) {
                    $stats['totalViews'] = 0;
                }
                
                echo json_encode($stats);
                break;

            case 'debug':
                // Debug endpoint to check table structure
                $tables = ['post', 'author', 'category', 'portfolio', 'portfoliocategory'];
                $debug = [];
                foreach ($tables as $table) {
                    $debug[$table] = getTableColumns($pdo, $table);
                }
                echo json_encode($debug);
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
                try {
                    $stmt = $pdo->prepare("INSERT INTO postview (postId, ipAddress, createdAt) VALUES (?, ?, NOW())");
                    $stmt->execute([$data['postId'], $_SERVER['REMOTE_ADDR'] ?? 'unknown']);
                    echo json_encode(['success' => true]);
                } catch (Exception $e) {
                    echo json_encode(['success' => true, 'note' => 'View tracking not available']);
                }
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