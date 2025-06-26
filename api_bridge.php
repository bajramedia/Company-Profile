<?php
header('Content-Type: application/json');
// Allow specific origins and fallback to *
$allowedOrigins = [
    'https://company-profile-git-main-bajra-media.vercel.app',
    'https://company-profile-c0emzkquv-bajra-media.vercel.app', 
    'https://bajramedia.vercel.app',
    'https://company-profile-mu-nine.vercel.app'
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
    $dateColumns = ['date', 'created_at', 'date_created', 'published_at', 'date', 'created'];
    foreach ($dateColumns as $col) {
        if (in_array($col, $columns)) {
            return $col;
        }
    }
    return 'id'; // fallback to id if no date column found
}

function generateUniqueId() {
    // Generate a unique ID similar to Prisma's format
    $timestamp = base_convert(time(), 10, 36);
    $random = base_convert(mt_rand(0, 2176782335), 10, 36); // 5 chars max
    return 'cm' . $timestamp . str_pad($random, 5, '0', STR_PAD_LEFT) . mt_rand(100, 999);
}

function generateSlug($title) {
    // Convert to lowercase and replace non-alphanumeric characters with hyphens
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
    return $slug;
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
                    
                    // Add date field for compatibility
                    if ($result && $dateCol !== 'date') {
                        $result['date'] = $result[$dateCol] ?? date('Y-m-d H:i:s');
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
                    
                    // Add date field for compatibility
                    foreach ($results as &$result) {
                        if ($dateCol !== 'date') {
                            $result['date'] = $result[$dateCol] ?? date('Y-m-d H:i:s');
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
                    
                    if ($result && $dateCol !== 'date') {
                        $result['date'] = $result[$dateCol] ?? date('Y-m-d H:i:s');
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
                        if ($dateCol !== 'date') {
                            $result['date'] = $result[$dateCol] ?? date('Y-m-d H:i:s');
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
            case 'posts':
                // Check if post table has id as auto increment or string
                $postColumns = getTableColumns($pdo, 'post');
                
                $title = $data['title'] ?? '';
                $slug = $data['slug'] ?? generateSlug($title);
                $excerpt = $data['excerpt'] ?? '';
                $content = $data['content'] ?? '';
                $featuredImage = $data['featuredImage'] ?? '';
                $published = $data['published'] ?? false;
                $readTime = $data['readTime'] ?? 5;
                $authorId = $data['authorId'] ?? 'cmbf4aq8s0000tsa4kiz9m58q'; // Valid author ID
                $categoryId = $data['categoryId'] ?? 'cmbf4aq900001tsa4kx7e1sgo'; // Valid category ID
                
                // Convert boolean to int for MySQL
                $publishedInt = $published ? 1 : 0;
                
                // Use auto-increment ID instead of custom generated ID
                $stmt = $pdo->prepare("
                    INSERT INTO post (title, slug, excerpt, content, featuredImage, published, readTime, authorId, categoryId, date) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ");
                $stmt->execute([$title, $slug, $excerpt, $content, $featuredImage, $publishedInt, $readTime, $authorId, $categoryId]);
                
                $postId = $pdo->lastInsertId();
                
                // Handle tags if provided
                if (isset($data['tags']) && is_array($data['tags'])) {
                    foreach ($data['tags'] as $tagId) {
                        $stmt = $pdo->prepare("INSERT INTO posttags (postId, tagId) VALUES (?, ?)");
                        $stmt->execute([$postId, $tagId]);
                    }
                }
                
                echo json_encode(['success' => true, 'id' => $postId]);
                break;

            case 'categories':
                // Create new category
                $name = $data['name'] ?? '';
                $slug = $data['slug'] ?? generateSlug($name);
                $description = $data['description'] ?? '';
                
                $stmt = $pdo->prepare("INSERT INTO category (name, slug, description) VALUES (?, ?, ?)");
                $stmt->execute([$name, $slug, $description]);
                
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;

            case 'authors':
                // Create new author
                $name = $data['name'] ?? '';
                $email = $data['email'] ?? '';
                $bio = $data['bio'] ?? '';
                $avatar = $data['avatar'] ?? '';
                
                $stmt = $pdo->prepare("INSERT INTO author (name, email, bio, avatar) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $email, $bio, $avatar]);
                
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;

            case 'tags':
                // Create new tag
                $name = $data['name'] ?? '';
                $slug = $data['slug'] ?? generateSlug($name);
                
                $stmt = $pdo->prepare("INSERT INTO tag (name, slug) VALUES (?, ?)");
                $stmt->execute([$name, $slug]);
                
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;

            case 'portfolio':
                // Create new portfolio
                $title = $data['title'] ?? '';
                $slug = $data['slug'] ?? generateSlug($title);
                $description = $data['description'] ?? '';
                $content = $data['content'] ?? '';
                $featuredImage = $data['featuredImage'] ?? '';
                $images = $data['images'] ?? null;
                $clientName = $data['clientName'] ?? '';
                $projectUrl = $data['projectUrl'] ?? '';
                $githubUrl = $data['githubUrl'] ?? '';
                $featured = $data['featured'] ?? false;
                $published = $data['published'] ?? false;
                $startDate = $data['startDate'] ?? null;
                $endDate = $data['endDate'] ?? null;
                $categoryId = $data['categoryId'] ?? '1';
                
                // Convert boolean to int for MySQL
                $featuredInt = $featured ? 1 : 0;
                $publishedInt = $published ? 1 : 0;
                
                // Check if portfolio table has date column or date
                $portfolioColumns = getTableColumns($pdo, 'portfolio');
                $hasdate = in_array('date', $portfolioColumns);
                
                if ($hasdate) {
                    $stmt = $pdo->prepare("
                        INSERT INTO portfolio (title, slug, description, content, featuredImage, images, clientName, projectUrl, githubUrl, featured, published, startDate, endDate, categoryId, date) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                    ");
                    $stmt->execute([$title, $slug, $description, $content, $featuredImage, $images, $clientName, $projectUrl, $githubUrl, $featuredInt, $publishedInt, $startDate, $endDate, $categoryId]);
                } else {
                    // Use without date if column doesn't exist
                    $stmt = $pdo->prepare("
                        INSERT INTO portfolio (title, slug, description, content, featuredImage, images, clientName, projectUrl, githubUrl, featured, published, startDate, endDate, categoryId) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([$title, $slug, $description, $content, $featuredImage, $images, $clientName, $projectUrl, $githubUrl, $featuredInt, $publishedInt, $startDate, $endDate, $categoryId]);
                }
                
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;

            case 'post-view':
                try {
                    $stmt = $pdo->prepare("INSERT INTO postview (postId, ipAddress, date) VALUES (?, ?, NOW())");
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

function handlePut($pdo, $endpoint, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        switch ($endpoint) {
            case 'posts':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                // Update post
                $title = $data['title'] ?? '';
                $slug = $data['slug'] ?? generateSlug($title);
                $excerpt = $data['excerpt'] ?? '';
                $content = $data['content'] ?? '';
                $featuredImage = $data['featuredImage'] ?? '';
                $published = $data['published'] ?? false;
                $readTime = $data['readTime'] ?? 5;
                $authorId = $data['authorId'] ?? '1';
                $categoryId = $data['categoryId'] ?? '1';
                
                // Convert boolean to int for MySQL
                $publishedInt = $published ? 1 : 0;
                
                $stmt = $pdo->prepare("
                    UPDATE post 
                    SET title = ?, slug = ?, excerpt = ?, content = ?, featuredImage = ?, 
                        published = ?, readTime = ?, authorId = ?, categoryId = ?, updatedAt = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$title, $slug, $excerpt, $content, $featuredImage, $publishedInt, $readTime, $authorId, $categoryId, $id]);
                
                // Handle tags - first delete existing ones
                $stmt = $pdo->prepare("DELETE FROM posttags WHERE postId = ?");
                $stmt->execute([$id]);
                
                // Add new tags
                if (isset($data['tags']) && is_array($data['tags'])) {
                    foreach ($data['tags'] as $tagId) {
                        $stmt = $pdo->prepare("INSERT INTO posttags (postId, tagId) VALUES (?, ?)");
                        $stmt->execute([$id, $tagId]);
                    }
                }
                
                echo json_encode(['success' => true]);
                break;

            case 'categories':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                $name = $data['name'] ?? '';
                $slug = $data['slug'] ?? generateSlug($name);
                $description = $data['description'] ?? '';
                
                $stmt = $pdo->prepare("UPDATE category SET name = ?, slug = ?, description = ? WHERE id = ?");
                $stmt->execute([$name, $slug, $description, $id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'authors':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                $name = $data['name'] ?? '';
                $email = $data['email'] ?? '';
                $bio = $data['bio'] ?? '';
                $avatar = $data['avatar'] ?? '';
                
                $stmt = $pdo->prepare("UPDATE author SET name = ?, email = ?, bio = ?, avatar = ? WHERE id = ?");
                $stmt->execute([$name, $email, $bio, $avatar, $id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'tags':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                $name = $data['name'] ?? '';
                $slug = $data['slug'] ?? generateSlug($name);
                
                $stmt = $pdo->prepare("UPDATE tag SET name = ?, slug = ? WHERE id = ?");
                $stmt->execute([$name, $slug, $id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'portfolio':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                $title = $data['title'] ?? '';
                $slug = $data['slug'] ?? generateSlug($title);
                $description = $data['description'] ?? '';
                $content = $data['content'] ?? '';
                $featuredImage = $data['featuredImage'] ?? '';
                $images = $data['images'] ?? null;
                $clientName = $data['clientName'] ?? '';
                $projectUrl = $data['projectUrl'] ?? '';
                $githubUrl = $data['githubUrl'] ?? '';
                $featured = $data['featured'] ?? false;
                $published = $data['published'] ?? false;
                $startDate = $data['startDate'] ?? null;
                $endDate = $data['endDate'] ?? null;
                $categoryId = $data['categoryId'] ?? '1';
                
                // Convert boolean to int for MySQL
                $featuredInt = $featured ? 1 : 0;
                $publishedInt = $published ? 1 : 0;
                
                $stmt = $pdo->prepare("
                    UPDATE portfolio 
                    SET title = ?, slug = ?, description = ?, content = ?, featuredImage = ?, images = ?,
                        clientName = ?, projectUrl = ?, githubUrl = ?, featured = ?, published = ?,
                        startDate = ?, endDate = ?, categoryId = ?, updatedAt = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$title, $slug, $description, $content, $featuredImage, $images, $clientName, $projectUrl, $githubUrl, $featuredInt, $publishedInt, $startDate, $endDate, $categoryId, $id]);
                
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
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                // Delete in proper order to maintain referential integrity
                // 1. Delete post views
                $stmt = $pdo->prepare("DELETE FROM postview WHERE postId = ?");
                $stmt->execute([$id]);
                
                // 2. Delete post tags
                $stmt = $pdo->prepare("DELETE FROM posttags WHERE postId = ?");
                $stmt->execute([$id]);
                
                // 3. Delete the post
                $stmt = $pdo->prepare("DELETE FROM post WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'categories':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                $stmt = $pdo->prepare("DELETE FROM category WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'authors':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                $stmt = $pdo->prepare("DELETE FROM author WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'tags':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                // Delete tag relations first
                $stmt = $pdo->prepare("DELETE FROM posttags WHERE tagId = ?");
                $stmt->execute([$id]);
                
                // Delete the tag
                $stmt = $pdo->prepare("DELETE FROM tag WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'portfolio':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                // Delete portfolio (check for related data first if needed)
                try {
                    // Delete portfolio tags if exists
                    $stmt = $pdo->prepare("DELETE FROM portfoliotags WHERE portfolioId = ?");
                    $stmt->execute([$id]);
                } catch (Exception $e) {
                    // Portfolio tags table might not exist, continue
                }
                
                // Delete the portfolio
                $stmt = $pdo->prepare("DELETE FROM portfolio WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'portfolio-categories':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                $stmt = $pdo->prepare("DELETE FROM portfoliocategory WHERE id = ?");
                $stmt->execute([$id]);
                
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