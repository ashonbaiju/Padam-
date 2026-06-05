<?php
/**
 * TMDB API Proxy - forwards requests to The Movie Database API.
 * Get a free API key: https://www.themoviedb.org/settings/api
 * 
 * Usage: GET /api/tmdb/popular
 *        GET /api/tmdb/search?q=batman
 *        GET /api/tmdb/movie/550    (movie details)
 *        GET /api/tmdb/trending
 */

// ─── CONFIGURATION ───────────────────────────────────────────
// Replace with your own TMDB API key from https://www.themoviedb.org/settings/api
define('TMDB_API_KEY', 'YOUR_TMDB_API_KEY_HERE');
define('TMDB_BASE', 'https://api.themoviedb.org/3');
// ──────────────────────────────────────────────────────────────

function handle_tmdb(string $method, ?string $id): void {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        http_response_code(401);
        echo json_encode([
            'error' => 'TMDB API key not configured',
            'message' => 'Get a free API key at https://www.themoviedb.org/settings/api, then set define(\'TMDB_API_KEY\', \'your_key\') in php-api/handlers/tmdb.php',
        ]);
        return;
    }

    $path = $_GET['path'] ?? ($id ?? 'popular');
    $query = $_GET['q'] ?? '';
    $page = (int)($_GET['page'] ?? 1);

    // Build TMDB URL
    if ($query) {
        $url = TMDB_BASE . '/search/movie?query=' . urlencode($query) . '&page=' . $page . '&language=en-US';
    } elseif ($path === 'popular') {
        $url = TMDB_BASE . '/movie/popular?page=' . $page . '&language=en-US';
    } elseif ($path === 'trending') {
        $url = TMDB_BASE . '/trending/movie/week?language=en-US';
    } elseif (is_numeric($path)) {
        $url = TMDB_BASE . '/movie/' . $path . '?append_to_response=credits,videos,similar&language=en-US';
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid TMDB path']);
        return;
    }

    // Fetch from TMDB
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . TMDB_API_KEY,
            'Accept: application/json',
        ],
        CURLOPT_TIMEOUT => 10,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        http_response_code(502);
        echo json_encode(['error' => 'TMDB API error', 'tmdb_code' => $httpCode]);
        return;
    }

    // Format response similar to our API format
    $data = json_decode($response, true);

    echo json_encode([
        'success' => true,
        'source' => 'tmdb',
        'data' => $data,
    ]);
}
