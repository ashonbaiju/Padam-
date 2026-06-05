<?php
// API Router — routes requests to the correct handler

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse the requested endpoint from the URL
$request_uri = $_SERVER['REQUEST_URI'];
// Strip query string
$path = parse_url($request_uri, PHP_URL_PATH);
// Remove the base path /streamflix/api/
$path = preg_replace('#^/streamflix/api#', '', $path);
$path = trim($path, '/');

$method = $_SERVER['REQUEST_METHOD'];
$segments = explode('/', $path);
$endpoint = $segments[0] ?? '';
$id       = $segments[1] ?? null;

// ─── Route to handlers ───────────────────────────────────────────
switch ($endpoint) {
    case 'movies':
        require_once __DIR__ . '/handlers/movies.php';
        handle_movies($method, $id);
        break;

    case 'watchlist':
        require_once __DIR__ . '/handlers/watchlist.php';
        handle_watchlist($method, $id);
        break;

    case 'search':
        require_once __DIR__ . '/handlers/search.php';
        handle_search($method);
        break;

    case 'auth':
        require_once __DIR__ . '/handlers/auth.php';
        handle_auth($method);
        break;

    case 'tmdb':
        require_once __DIR__ . '/handlers/tmdb.php';
        handle_tmdb($method, $id);
        break;

    case 'health':
        echo json_encode([
            'status'  => 'ok',
            'php'     => PHP_VERSION,
            'time'    => date('c'),
            'message' => 'StreamFlix PHP API is running 🎬',
        ]);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found', 'path' => $path]);
        break;
}
