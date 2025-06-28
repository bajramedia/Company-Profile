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

// ====================================
// REST-STYLE ROUTING SUPPORT
// ====================================
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Check if this is REST-style endpoint (api_bridge.php/endpoint)
$endpoint = '';
$id = null;

if (strpos($path, '/api_bridge.php/') !== false) {
    // Parse REST-style path: /api_bridge.php/technologies/123
    $pathParts = explode('/api_bridge.php/', $path);
    if (count($pathParts) > 1) {
        $restPath = trim($pathParts[1], '/');
        $restParts = explode('/', $restPath);
        
        if (!empty($restParts[0])) {
            $endpoint = $restParts[0];
            $id = $restParts[1] ?? null;
            
            // Log REST routing
            error_log("REST Route detected: endpoint='$endpoint', id='$id'");
        }
    }
}

// Fallback to original query parameter method for backward compatibility
if (empty($endpoint)) {
    $endpoint = $_GET['endpoint'] ?? '';
    $id = $_GET['id'] ?? null;
    
    if (!empty($endpoint)) {
        error_log("Query Route detected: endpoint='$endpoint', id='$id'");
    }
}

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
    // ENHANCED SECURITY - Hide all sensitive endpoints in production
    $hiddenEndpoints = [
        'debug', 'test', 'stats-full', 'database-info', 'server-info'
    ];
    
    // Allow essential endpoints for public access AND admin endpoints
    $allowedPublicEndpoints = ['posts', 'portfolio', 'categories', 'portfolio-categories', 'authors', 'tags', 'stats', 'settings', 'team-members', 'about-content', 'team', 'about', 'partners', 'new-settings', 'blog-posts', 'portfolio-items'];
    
    // Check if it's production environment
    $isProduction = isset($_SERVER['HTTP_HOST']) && (
        $_SERVER['HTTP_HOST'] === 'bajramedia.com' || 
        strpos($_SERVER['HTTP_HOST'], 'vercel.app') !== false ||
        $_SERVER['HTTP_HOST'] === 'www.bajramedia.com'
    );
    
    // In production, block access ONLY to hidden endpoints, allow all others
    if ($isProduction) {
        if (in_array($endpoint, $hiddenEndpoints)) {
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
            return;
        }
    }
    
    try {
        switch ($endpoint) {
            case 'posts':
                // DEBUG: Log received parameters
                error_log("Posts endpoint called with GET params: " . print_r($_GET, true));
                error_log("Request URI: " . $_SERVER['REQUEST_URI']);
                
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
                    
                    error_log("Posts pagination: page=$page, limit=$limit, offset=$offset");
                    
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
                    
                    error_log("Posts SQL: " . $sql);
                    $stmt = $pdo->query($sql);
                    $results = $stmt->fetchAll();
                    
                    error_log("Posts found: " . count($results));
                    
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
                
                // Original stats
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
                
                // New stats for new tables
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM blog_posts WHERE is_published = 1");
                    $stats['totalBlogPosts'] = $stmt->fetch()['count'];
                } catch (Exception $e) {
                    $stats['totalBlogPosts'] = 0;
                }
                
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM portfolio_items WHERE is_published = 1");
                    $stats['totalPortfolioItems'] = $stmt->fetch()['count'];
                } catch (Exception $e) {
                    $stats['totalPortfolioItems'] = 0;
                }
                
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM team_members WHERE is_active = 1");
                    $stats['totalTeamMembers'] = $stmt->fetch()['count'];
                } catch (Exception $e) {
                    $stats['totalTeamMembers'] = 0;
                }
                
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM partners WHERE is_active = 1");
                    $stats['totalPartners'] = $stmt->fetch()['count'];
                } catch (Exception $e) {
                    $stats['totalPartners'] = 0;
                }
                
                try {
                    $stmt = $pdo->query("SELECT SUM(view_count) as total FROM blog_posts");
                    $stats['totalBlogViews'] = $stmt->fetch()['total'] ?: 0;
                } catch (Exception $e) {
                    $stats['totalBlogViews'] = 0;
                }
                
                echo json_encode($stats);
                break;

            // ====================================
            // NEW ENDPOINTS FOR NEW TABLES
            // ====================================
            
            case 'team':
            case 'team-members':
                $stmt = $pdo->query("
                    SELECT * FROM team_members 
                    WHERE is_active = 1 
                    ORDER BY sort_order ASC
                ");
                $results = $stmt->fetchAll();
                
                // Format for frontend compatibility
                foreach ($results as &$result) {
                    $result['imageUrl'] = $result['image_url'];
                    $result['linkedinUrl'] = $result['linkedin_url'];
                    $result['githubUrl'] = $result['github_url'];
                    $result['instagramUrl'] = $result['instagram_url'];
                    $result['behanceUrl'] = $result['behance_url'];
                    $result['roleEn'] = $result['role_en'];
                    $result['roleId'] = $result['role_id'];
                    $result['bioEn'] = $result['bio_en'];
                    $result['bioId'] = $result['bio_id'];
                }
                
                echo json_encode($results);
                break;

            case 'partners':
                $stmt = $pdo->query("
                    SELECT * FROM partners 
                    WHERE is_active = 1 
                    ORDER BY sort_order ASC
                ");
                $results = $stmt->fetchAll();
                
                // Format for frontend compatibility
                foreach ($results as &$result) {
                    $result['nameEn'] = $result['name_en'];
                    $result['nameId'] = $result['name_id'];
                    $result['descriptionEn'] = $result['description_en'];
                    $result['descriptionId'] = $result['description_id'];
                    $result['logoUrl'] = $result['logo_url'];
                    $result['websiteUrl'] = $result['website_url'];
                    $result['partnerType'] = $result['partner_type'];
                }
                
                echo json_encode($results);
                break;

            case 'about':
            case 'about-content':
                if ($id) {
                    // Get single about content by ID
                    $stmt = $pdo->prepare("SELECT * FROM about_content WHERE id = ?");
                    $stmt->execute([$id]);
                    $result = $stmt->fetch();
                    echo json_encode($result);
                } else {
                    // Get all about content
                    $stmt = $pdo->query("
                        SELECT * FROM about_content 
                        WHERE is_active = 1 
                        ORDER BY id ASC
                    ");
                    $results = $stmt->fetchAll();
                    echo json_encode($results);
                }
                break;

            case 'new-settings':
                // New settings table (relational structure)
                $stmt = $pdo->query("SELECT * FROM settings LIMIT 1");
                $result = $stmt->fetch();
                
                if ($result) {
                    // Format for frontend compatibility
                    $result['siteName'] = $result['site_name'];
                    $result['siteDescriptionEn'] = $result['site_description_en'];
                    $result['siteDescriptionId'] = $result['site_description_id'];
                    $result['contactEmail'] = $result['contact_email'];
                    $result['contactPhone'] = $result['contact_phone'];
                    $result['contactAddressEn'] = $result['contact_address_en'];
                    $result['contactAddressId'] = $result['contact_address_id'];
                    $result['socialInstagram'] = $result['social_instagram'];
                    $result['socialLinkedin'] = $result['social_linkedin'];
                    $result['socialGithub'] = $result['social_github'];
                }
                
                echo json_encode($result ?: []);
                break;

            case 'blog-posts':
                // New blog posts table
                if ($id) {
                    // Get single blog post by slug or id
                    $stmt = $pdo->prepare("
                        SELECT * FROM blog_posts 
                        WHERE (slug = ? OR id = ?) AND is_published = 1
                    ");
                    $stmt->execute([$id, $id]);
                    $result = $stmt->fetch();
                    
                    if ($result) {
                        // Format for frontend compatibility
                        $result['authorName'] = $result['author_name'];
                        $result['featuredImage'] = $result['featured_image'];
                        $result['readTime'] = $result['reading_time'];
                        $result['date'] = $result['published_at'] ?? $result['created_at'];
                        $result['published'] = $result['is_published'];
                        $result['featured'] = $result['is_featured'];
                    }
                    
                    echo json_encode($result);
                } else {
                    // Get all published blog posts
                    $page = max(1, intval($_GET['page'] ?? 1));
                    $limit = max(1, min(100, intval($_GET['limit'] ?? 10)));
                    $offset = ($page - 1) * $limit;
                    
                    $stmt = $pdo->prepare("
                        SELECT * FROM blog_posts 
                        WHERE is_published = 1 
                        ORDER BY published_at DESC, created_at DESC 
                        LIMIT ? OFFSET ?
                    ");
                    $stmt->execute([$limit, $offset]);
                    $results = $stmt->fetchAll();
                    
                    // Format for frontend compatibility
                    foreach ($results as &$result) {
                        $result['authorName'] = $result['author_name'];
                        $result['featuredImage'] = $result['featured_image'];
                        $result['readTime'] = $result['reading_time'];
                        $result['date'] = $result['published_at'] ?? $result['created_at'];
                        $result['published'] = $result['is_published'];
                        $result['featured'] = $result['is_featured'];
                    }
                    
                    echo json_encode($results);
                }
                break;

            case 'portfolio-items':
                // New portfolio items table with images and tags
                if ($id) {
                    // Get single portfolio by slug with images and tags
                    $stmt = $pdo->prepare("
                        SELECT p.*,
                               GROUP_CONCAT(DISTINCT CONCAT(pi.image_url, '|', COALESCE(pi.alt_text, '')) ORDER BY pi.sort_order) as images,
                               GROUP_CONCAT(DISTINCT CONCAT(pt.tag_name, '|', COALESCE(pt.tag_color, '#000000'))) as tags
                        FROM portfolio_items p
                        LEFT JOIN portfolio_images pi ON p.id = pi.portfolio_id
                        LEFT JOIN portfolio_tags pt ON p.id = pt.portfolio_id
                        WHERE (p.slug = ? OR p.id = ?) AND p.is_published = 1
                        GROUP BY p.id
                    ");
                    $stmt->execute([$id, $id]);
                    $result = $stmt->fetch();
                    
                    if ($result) {
                        // Format for frontend compatibility
                        $result['featuredImage'] = $result['featured_image'];
                        $result['clientName'] = $result['client_name'];
                        $result['projectUrl'] = $result['project_url'];
                        $result['githubUrl'] = $result['github_url'];
                        $result['categoryName'] = $result['category_en'];
                        $result['categoryIcon'] = $result['category_icon'];
                        $result['categoryColor'] = $result['category_color'];
                        $result['featured'] = $result['is_featured'];
                        $result['published'] = $result['is_published'];
                        $result['startDate'] = $result['start_date'];
                        $result['endDate'] = $result['end_date'];
                        $result['date'] = $result['created_at'];
                        
                        // Parse images and tags
                        if ($result['images']) {
                            $imagesList = explode(',', $result['images']);
                            $result['imageGallery'] = array_map(function($img) {
                                $parts = explode('|', $img);
                                return ['url' => $parts[0], 'alt' => $parts[1] ?? ''];
                            }, $imagesList);
                        } else {
                            $result['imageGallery'] = [];
                        }
                        
                        if ($result['tags']) {
                            $tagsList = explode(',', $result['tags']);
                            $result['technologies'] = array_map(function($tag) {
                                $parts = explode('|', $tag);
                                return ['name' => $parts[0], 'color' => $parts[1] ?? '#000000'];
                            }, $tagsList);
                        } else {
                            $result['technologies'] = [];
                        }
                        
                        unset($result['images'], $result['tags']);
                    }
                    
                    echo json_encode($result);
                } else {
                    // Get all published portfolio items
                    $stmt = $pdo->query("
                        SELECT * FROM portfolio_items 
                        WHERE is_published = 1 
                        ORDER BY is_featured DESC, sort_order ASC, created_at DESC
                    ");
                    $results = $stmt->fetchAll();
                    
                    // Format for frontend compatibility
                    foreach ($results as &$result) {
                        $result['featuredImage'] = $result['featured_image'];
                        $result['clientName'] = $result['client_name'];
                        $result['projectUrl'] = $result['project_url'];
                        $result['githubUrl'] = $result['github_url'];
                        $result['categoryName'] = $result['category_en'];
                        $result['categoryIcon'] = $result['category_icon'];
                        $result['categoryColor'] = $result['category_color'];
                        $result['featured'] = $result['is_featured'];
                        $result['published'] = $result['is_published'];
                        $result['date'] = $result['created_at'];
                    }
                    
                    echo json_encode($results);
                }
                break;

            case 'technologies':
                if ($id) {
                    // Get specific technology by ID
                    $stmt = $pdo->prepare("SELECT * FROM technologies WHERE id = ? AND is_active = 1");
                    $stmt->execute([$id]);
                    $result = $stmt->fetch();
                    echo json_encode($result ?: null);
                } else {
                    // Get all active technologies
                    $category = $_GET['category'] ?? '';
                    $include_inactive = $_GET['include_inactive'] ?? false;
                    
                    $sql = "SELECT * FROM technologies";
                    $params = [];
                    $where = [];
                    
                    if (!$include_inactive) {
                        $where[] = "is_active = 1";
                    }
                    
                    if ($category) {
                        $where[] = "category = ?";
                        $params[] = $category;
                    }
                    
                    if (!empty($where)) {
                        $sql .= " WHERE " . implode(" AND ", $where);
                    }
                    
                    $sql .= " ORDER BY category, sort_order ASC, name ASC";
                    
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($params);
                    $results = $stmt->fetchAll();
                    
                    echo json_encode($results);
                }
                break;

            case 'debug':
                // Debug endpoint to check table structure
                $tables = ['post', 'author', 'category', 'portfolio', 'portfoliocategory', 'team_members', 'partners', 'about_content', 'settings', 'blog_posts', 'portfolio_items', 'technologies'];
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

function fixEmptyIds($pdo, $tableName) {
    try {
        // Find records with empty ID
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM $tableName WHERE id = ''");
        $stmt->execute();
        $count = $stmt->fetchColumn();
        
        if ($count > 0) {
            // Update empty IDs with unique generated IDs
            $stmt = $pdo->prepare("SELECT * FROM $tableName WHERE id = ''");
            $stmt->execute();
            $emptyRecords = $stmt->fetchAll();
            
            foreach ($emptyRecords as $record) {
                $newId = generateUniqueId();
                $updateStmt = $pdo->prepare("UPDATE $tableName SET id = ? WHERE id = '' LIMIT 1");
                $updateStmt->execute([$newId]);
            }
        }
    } catch (Exception $e) {
        // Ignore errors - table might not have the issue
    }
}

function handlePost($pdo, $endpoint) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        switch ($endpoint) {
            case 'posts':
                // Validate required fields - NO FALLBACK DATA
                if (empty($data['title']) || empty($data['slug']) || empty($data['content'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Title, slug, and content are required']);
                    return;
                }
                
                if (empty($data['authorId']) || empty($data['categoryId'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Author and category are required']);
                    return;
                }
                
                $title = $data['title'];
                $slug = $data['slug'];
                $excerpt = $data['excerpt'] ?? '';
                $content = $data['content'];
                $featuredImage = $data['featuredImage'] ?? '';
                $published = $data['published'] ?? false;
                $readTime = $data['readTime'] ?? 5;
                $authorId = $data['authorId'];
                $categoryId = $data['categoryId'];
                
                // Convert boolean to int for MySQL
                $publishedInt = $published ? 1 : 0;
                
                // Use auto-increment ID - let database generate ID
                $stmt = $pdo->prepare("
                    INSERT INTO post (title, slug, excerpt, content, featuredImage, published, readTime, authorId, categoryId, date) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ");
                $stmt->execute([$title, $slug, $excerpt, $content, $featuredImage, $publishedInt, $readTime, $authorId, $categoryId]);
                
                $postId = $pdo->lastInsertId();
                
                // Handle tags if provided
                if (isset($data['tags']) && is_array($data['tags'])) {
                    foreach ($data['tags'] as $tagId) {
                        if (!empty($tagId)) {
                        $stmt = $pdo->prepare("INSERT INTO posttags (postId, tagId) VALUES (?, ?)");
                        $stmt->execute([$postId, $tagId]);
                        }
                    }
                }
                
                echo json_encode(['success' => true, 'id' => $postId]);
                break;

            case 'categories':
                // Fix any existing empty IDs first
                fixEmptyIds($pdo, 'category');
                
                // Validate required fields
                if (empty($data['name'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Name is required']);
                    return;
                }
                
                $name = trim($data['name']);
                $slug = $data['slug'] ?? generateSlug($name);
                $description = $data['description'] ?? '';
                
                // Check table structure first
                $categoryColumns = getTableColumns($pdo, 'category');
                $hasDescription = in_array('description', $categoryColumns);
                
                // Check if ID column is auto-increment by trying to get column info
                $stmt = $pdo->query("SHOW COLUMNS FROM category WHERE Field = 'id'");
                $idColumn = $stmt->fetch();
                $isAutoIncrement = strpos(strtolower($idColumn['Extra'] ?? ''), 'auto_increment') !== false;
                
                if ($isAutoIncrement) {
                    // Use auto-increment
                if ($hasDescription) {
                $stmt = $pdo->prepare("INSERT INTO category (name, slug, description) VALUES (?, ?, ?)");
                $stmt->execute([$name, $slug, $description]);
                } else {
                    $stmt = $pdo->prepare("INSERT INTO category (name, slug) VALUES (?, ?)");
                    $stmt->execute([$name, $slug]);
                }
                    $categoryId = $pdo->lastInsertId();
                } else {
                    // Generate unique string ID
                    $categoryId = generateUniqueId();
                    if ($hasDescription) {
                        $stmt = $pdo->prepare("INSERT INTO category (id, name, slug, description) VALUES (?, ?, ?, ?)");
                        $stmt->execute([$categoryId, $name, $slug, $description]);
                    } else {
                        $stmt = $pdo->prepare("INSERT INTO category (id, name, slug) VALUES (?, ?, ?)");
                        $stmt->execute([$categoryId, $name, $slug]);
                    }
                }
                
                echo json_encode(['success' => true, 'id' => $categoryId]);
                break;

            case 'authors':
                // Fix any existing empty IDs first
                fixEmptyIds($pdo, 'author');
                
                // Validate required fields
                if (empty($data['name']) || empty($data['email'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Name and email are required']);
                    return;
                }
                
                $name = trim($data['name']);
                $email = trim($data['email']);
                $bio = $data['bio'] ?? '';
                $avatar = $data['avatar'] ?? '';
                
                // Validate email format
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid email format']);
                    return;
                }
                
                // Check if ID column is auto-increment
                $stmt = $pdo->query("SHOW COLUMNS FROM author WHERE Field = 'id'");
                $idColumn = $stmt->fetch();
                $isAutoIncrement = strpos(strtolower($idColumn['Extra'] ?? ''), 'auto_increment') !== false;
                
                if ($isAutoIncrement) {
                    // Use auto-increment
                $stmt = $pdo->prepare("INSERT INTO author (name, email, bio, avatar) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $email, $bio, $avatar]);
                    $authorId = $pdo->lastInsertId();
                } else {
                    // Generate unique string ID
                    $authorId = generateUniqueId();
                    $stmt = $pdo->prepare("INSERT INTO author (id, name, email, bio, avatar) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$authorId, $name, $email, $bio, $avatar]);
                }
                
                echo json_encode(['success' => true, 'id' => $authorId]);
                break;

            case 'tags':
                // Fix any existing empty IDs first
                fixEmptyIds($pdo, 'tag');
                
                // Validate required fields
                if (empty($data['name'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Name is required']);
                    return;
                }
                
                $name = trim($data['name']);
                $slug = $data['slug'] ?? generateSlug($name);
                $description = $data['description'] ?? '';
                
                // Check table structure
                $tagColumns = getTableColumns($pdo, 'tag');
                $hasDescription = in_array('description', $tagColumns);
                
                // Check if ID column is auto-increment
                $stmt = $pdo->query("SHOW COLUMNS FROM tag WHERE Field = 'id'");
                $idColumn = $stmt->fetch();
                $isAutoIncrement = strpos(strtolower($idColumn['Extra'] ?? ''), 'auto_increment') !== false;
                
                if ($isAutoIncrement) {
                    // Use auto-increment
                    if ($hasDescription) {
                        $stmt = $pdo->prepare("INSERT INTO tag (name, slug, description) VALUES (?, ?, ?)");
                        $stmt->execute([$name, $slug, $description]);
                    } else {
                $stmt = $pdo->prepare("INSERT INTO tag (name, slug) VALUES (?, ?)");
                $stmt->execute([$name, $slug]);
                    }
                    $tagId = $pdo->lastInsertId();
                } else {
                    // Generate unique string ID
                    $tagId = generateUniqueId();
                    if ($hasDescription) {
                        $stmt = $pdo->prepare("INSERT INTO tag (id, name, slug, description) VALUES (?, ?, ?, ?)");
                        $stmt->execute([$tagId, $name, $slug, $description]);
                    } else {
                        $stmt = $pdo->prepare("INSERT INTO tag (id, name, slug) VALUES (?, ?, ?)");
                        $stmt->execute([$tagId, $name, $slug]);
                    }
                }
                
                echo json_encode(['success' => true, 'id' => $tagId]);
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
                
            case 'about-content':
                // Create new about content
                $section_key = $data['section_key'] ?? '';
                $title_en = $data['title_en'] ?? '';
                $title_id = $data['title_id'] ?? '';
                $content_en = $data['content_en'] ?? '';
                $content_id = $data['content_id'] ?? '';
                
                $stmt = $pdo->prepare("
                    INSERT INTO about_content (section_key, title_en, title_id, content_en, content_id) 
                    VALUES (?, ?, ?, ?, ?)
                ");
                $stmt->execute([$section_key, $title_en, $title_id, $content_en, $content_id]);
                
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;
                
            case 'team-members':
                // Create new team member
                $name = $data['name'] ?? '';
                $role_en = $data['role_en'] ?? '';
                $role_id = $data['role_id'] ?? '';
                $bio_en = $data['bio_en'] ?? '';
                $bio_id = $data['bio_id'] ?? '';
                $image_url = $data['image_url'] ?? '';
                $linkedin_url = $data['linkedin_url'] ?? '';
                $github_url = $data['github_url'] ?? '';
                $instagram_url = $data['instagram_url'] ?? '';
                $behance_url = $data['behance_url'] ?? '';
                $tiktok_url = $data['tiktok_url'] ?? '';
                $youtube_url = $data['youtube_url'] ?? '';
                $sort_order = $data['sort_order'] ?? 0;
                $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
                
                $stmt = $pdo->prepare("
                    INSERT INTO team_members (name, role_en, role_id, bio_en, bio_id, image_url, linkedin_url, github_url, instagram_url, behance_url, tiktok_url, youtube_url, sort_order, is_active) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$name, $role_en, $role_id, $bio_en, $bio_id, $image_url, $linkedin_url, $github_url, $instagram_url, $behance_url, $tiktok_url, $youtube_url, $sort_order, $is_active]);
                
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;
                
            case 'partners':
                // Create new partner
                $name_en = $data['name_en'] ?? '';
                $name_id = $data['name_id'] ?? '';
                $description_en = $data['description_en'] ?? '';
                $description_id = $data['description_id'] ?? '';
                $logo_url = $data['logo_url'] ?? '';
                $website_url = $data['website_url'] ?? '';
                $partner_type = $data['partner_type'] ?? 'company';
                $sort_order = $data['sort_order'] ?? 0;
                
                $stmt = $pdo->prepare("
                    INSERT INTO partners (name_en, name_id, description_en, description_id, logo_url, website_url, partner_type, sort_order) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$name_en, $name_id, $description_en, $description_id, $logo_url, $website_url, $partner_type, $sort_order]);
                
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;

            case 'technologies':
                // Create new technology
                if (empty($data['name']) || empty($data['icon'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Name and icon are required']);
                    return;
                }
                
                $name = trim($data['name']);
                $icon = trim($data['icon']);
                $description_en = $data['description_en'] ?? '';
                $description_id = $data['description_id'] ?? '';
                $category = $data['category'] ?? 'general';
                $color = $data['color'] ?? '#6B7280';
                $sort_order = $data['sort_order'] ?? 0;
                $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
                
                // Validate category
                $validCategories = ['web', 'mobile', 'uiux', 'game', 'system', 'marketing', 'general'];
                if (!in_array($category, $validCategories)) {
                    $category = 'general';
                }
                
                $stmt = $pdo->prepare("
                    INSERT INTO technologies (name, icon, description_en, description_id, category, color, sort_order, is_active) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$name, $icon, $description_en, $description_id, $category, $color, $sort_order, $is_active]);
                
                echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
                break;

            case 'settings':
                // Update settings - bulk update approach with proper transaction
                try {
                    // Start transaction for atomicity
                    $pdo->beginTransaction();
                    
                    // Check if setting table exists
                    $stmt = $pdo->query("SHOW TABLES LIKE 'setting'");
                    $tableExists = $stmt->fetch();
                    
                    if (!$tableExists) {
                        // Create settings table if it doesn't exist (minimal structure)
                        $createTableSQL = "CREATE TABLE setting (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            `key` VARCHAR(255) UNIQUE NOT NULL,
                            `value` TEXT,
                            `type` VARCHAR(50) DEFAULT 'string',
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                        )";
                        $pdo->exec($createTableSQL);
                    }
                    
                    // Check current table structure
                    $columns = getTableColumns($pdo, 'setting');
                    $hasUpdatedAt = in_array('updated_at', $columns);
                    $hasType = in_array('type', $columns);
                    
                    // Update or insert settings
                    $updatedCount = 0;
                    $errors = [];
                    
                    foreach ($data as $key => $value) {
                        try {
                            // Skip empty keys
                            if (empty($key)) {
                                continue;
                            }
                            
                            // Convert value to string for storage
                            $valueStr = is_array($value) || is_object($value) ? json_encode($value) : (string)$value;
                            $type = is_array($value) || is_object($value) ? 'json' : (is_bool($value) ? 'boolean' : (is_numeric($value) ? 'number' : 'string'));
                            
                            if ($hasUpdatedAt && $hasType) {
                                // Full table with type and updated_at
                                $sql = "INSERT INTO setting (`key`, `value`, `type`) 
                                       VALUES (?, ?, ?) 
                                       ON DUPLICATE KEY UPDATE 
                                       `value` = VALUES(`value`), 
                                       `type` = VALUES(`type`), 
                                       updated_at = NOW()";
                                $stmt = $pdo->prepare($sql);
                                $result = $stmt->execute([$key, $valueStr, $type]);
                            } elseif ($hasUpdatedAt) {
                                // Table with updated_at but no type
                                $sql = "INSERT INTO setting (`key`, `value`) 
                                       VALUES (?, ?) 
                                       ON DUPLICATE KEY UPDATE 
                                       `value` = VALUES(`value`), 
                                       updated_at = NOW()";
                                $stmt = $pdo->prepare($sql);
                                $result = $stmt->execute([$key, $valueStr]);
                            } else {
                                // Minimal table structure
                                $sql = "INSERT INTO setting (`key`, `value`) 
                                       VALUES (?, ?) 
                                       ON DUPLICATE KEY UPDATE 
                                       `value` = VALUES(`value`)";
                                $stmt = $pdo->prepare($sql);
                                $result = $stmt->execute([$key, $valueStr]);
                            }
                            
                            if ($result) {
                                $updatedCount++;
                            } else {
                                $error = $stmt->errorInfo();
                                $errors[] = "Failed to save key '$key': " . $error[2];
                            }
                            
                        } catch (Exception $keyError) {
                            $errors[] = "Error saving key '$key': " . $keyError->getMessage();
                        }
                    }
                    
                    // Commit transaction if no errors
                    if (empty($errors)) {
                        $pdo->commit();
                        
                        // Verify data was actually saved
                        $stmt = $pdo->query("SELECT COUNT(*) as count FROM setting");
                        $totalSettings = $stmt->fetch()['count'];
                        
                        echo json_encode([
                            'success' => true, 
                            'updated' => $updatedCount,
                            'total_in_db' => $totalSettings
                        ]);
                    } else {
                        $pdo->rollBack();
                        throw new Exception('Some settings failed to save: ' . implode(', ', $errors));
                    }
                    
                } catch (Exception $e) {
                    // Rollback transaction on any error
                    if ($pdo->inTransaction()) {
                        $pdo->rollBack();
                    }
                    http_response_code(500);
                    echo json_encode(['error' => 'Settings error: ' . $e->getMessage()]);
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

            case 'about-content':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                $section_key = $data['section_key'] ?? '';
                $title_en = $data['title_en'] ?? '';
                $title_id = $data['title_id'] ?? '';
                $content_en = $data['content_en'] ?? '';
                $content_id = $data['content_id'] ?? '';
                $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
                
                $stmt = $pdo->prepare("
                    UPDATE about_content 
                    SET section_key = ?, title_en = ?, title_id = ?, content_en = ?, content_id = ?, is_active = ?, updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$section_key, $title_en, $title_id, $content_en, $content_id, $is_active, $id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'team-members':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                $name = $data['name'] ?? '';
                $role_en = $data['role_en'] ?? '';
                $role_id = $data['role_id'] ?? '';
                $bio_en = $data['bio_en'] ?? '';
                $bio_id = $data['bio_id'] ?? '';
                $image_url = $data['image_url'] ?? '';
                $linkedin_url = $data['linkedin_url'] ?? '';
                $github_url = $data['github_url'] ?? '';
                $instagram_url = $data['instagram_url'] ?? '';
                $behance_url = $data['behance_url'] ?? '';
                $tiktok_url = $data['tiktok_url'] ?? '';
                $youtube_url = $data['youtube_url'] ?? '';
                $sort_order = $data['sort_order'] ?? 0;
                $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
                
                $stmt = $pdo->prepare("
                    UPDATE team_members 
                    SET name = ?, role_en = ?, role_id = ?, bio_en = ?, bio_id = ?, image_url = ?, 
                        linkedin_url = ?, github_url = ?, instagram_url = ?, behance_url = ?, 
                        tiktok_url = ?, youtube_url = ?, sort_order = ?, is_active = ?, updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$name, $role_en, $role_id, $bio_en, $bio_id, $image_url, $linkedin_url, $github_url, $instagram_url, $behance_url, $tiktok_url, $youtube_url, $sort_order, $is_active, $id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'partners':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                $name_en = $data['name_en'] ?? '';
                $name_id = $data['name_id'] ?? '';
                $description_en = $data['description_en'] ?? '';
                $description_id = $data['description_id'] ?? '';
                $logo_url = $data['logo_url'] ?? '';
                $website_url = $data['website_url'] ?? '';
                $partner_type = $data['partner_type'] ?? 'company';
                $sort_order = $data['sort_order'] ?? 0;
                $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
                
                $stmt = $pdo->prepare("
                    UPDATE partners 
                    SET name_en = ?, name_id = ?, description_en = ?, description_id = ?, 
                        logo_url = ?, website_url = ?, partner_type = ?, sort_order = ?, is_active = ?, updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$name_en, $name_id, $description_en, $description_id, $logo_url, $website_url, $partner_type, $sort_order, $is_active, $id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'settings':
                // Update single setting by key
                $key = $_GET['key'] ?? $id; // Support both ?key= and /key format
                if (!$key) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Setting key required for update']);
                    return;
                }
                
                $value = $data['value'] ?? '';
                $valueStr = is_array($value) || is_object($value) ? json_encode($value) : (string)$value;
                
                // Check if table has updated_at column
                $columns = getTableColumns($pdo, 'setting');
                $hasUpdatedAt = in_array('updated_at', $columns);
                
                if ($hasUpdatedAt) {
                    // Use updated_at if column exists
                    $stmt = $pdo->prepare("
                        INSERT INTO setting (`key`, `value`) 
                        VALUES (?, ?) 
                        ON DUPLICATE KEY UPDATE 
                        `value` = VALUES(`value`), updated_at = NOW()
                    ");
                } else {
                    // Don't use updated_at if column doesn't exist
                    $stmt = $pdo->prepare("
                        INSERT INTO setting (`key`, `value`) 
                        VALUES (?, ?) 
                        ON DUPLICATE KEY UPDATE 
                        `value` = VALUES(`value`)
                    ");
                }
                $stmt->execute([$key, $valueStr]);
                
                echo json_encode(['success' => true]);
                break;

            case 'technologies':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for update']);
                    return;
                }
                
                if (empty($data['name']) || empty($data['icon'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Name and icon are required']);
                    return;
                }
                
                $name = trim($data['name']);
                $icon = trim($data['icon']);
                $description_en = $data['description_en'] ?? '';
                $description_id = $data['description_id'] ?? '';
                $category = $data['category'] ?? 'general';
                $color = $data['color'] ?? '#6B7280';
                $sort_order = $data['sort_order'] ?? 0;
                $is_active = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
                
                // Validate category
                $validCategories = ['web', 'mobile', 'uiux', 'game', 'system', 'marketing', 'general'];
                if (!in_array($category, $validCategories)) {
                    $category = 'general';
                }
                
                $stmt = $pdo->prepare("
                    UPDATE technologies 
                    SET name = ?, icon = ?, description_en = ?, description_id = ?, 
                        category = ?, color = ?, sort_order = ?, is_active = ?, updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$name, $icon, $description_en, $description_id, $category, $color, $sort_order, $is_active, $id]);
                
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

            case 'about-content':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                $stmt = $pdo->prepare("DELETE FROM about_content WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'team-members':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                $stmt = $pdo->prepare("DELETE FROM team_members WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'partners':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                $stmt = $pdo->prepare("DELETE FROM partners WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'technologies':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID required for delete']);
                    return;
                }
                
                // Soft delete by setting is_active = 0 (safer for data integrity)
                $stmt = $pdo->prepare("UPDATE technologies SET is_active = 0 WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true]);
                break;

            case 'settings':
                $key = $_GET['key'] ?? $id; // Support both ?key= and /key format
                if (!$key) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Setting key required for delete']);
                    return;
                }
                
                $stmt = $pdo->prepare("DELETE FROM setting WHERE `key` = ?");
                $stmt->execute([$key]);
                
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