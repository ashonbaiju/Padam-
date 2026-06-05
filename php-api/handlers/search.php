<?php
require_once __DIR__ . '/../data/movies_data.php';

/**
 * GET /api/search?q=query&genre=Action
 * Returns matching movies with relevance scoring.
 */
function handle_search(string $method): void {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $query = trim($_GET['q'] ?? '');
    $genre = trim($_GET['genre'] ?? '');

    if (empty($query) && empty($genre)) {
        echo json_encode(['success' => true, 'data' => [], 'count' => 0]);
        return;
    }

    $movies = get_all_movies();
    $results = [];

    foreach ($movies as $movie) {
        $score = 0;

        if ($query) {
            $q = strtolower($query);
            // Title match — highest weight
            if (str_contains(strtolower($movie['title']), $q)) {
                $score += stripos($movie['title'], $query) === 0 ? 20 : 10;
            }
            // Genre match
            foreach ($movie['genre'] as $g) {
                if (str_contains(strtolower($g), $q)) $score += 6;
            }
            // Description match
            if (str_contains(strtolower($movie['description']), $q)) {
                $score += 3;
            }
            // Tags match
            foreach (($movie['tags'] ?? []) as $tag) {
                if (str_contains(strtolower($tag), $q)) $score += 2;
            }
        }

        if ($genre) {
            foreach ($movie['genre'] as $g) {
                if (strtolower($g) === strtolower($genre)) {
                    $score += 5;
                    break;
                }
            }
        }

        if ($score > 0) {
            $movie['_score'] = $score;
            $results[] = $movie;
        }
    }

    // Sort by score descending
    usort($results, fn($a, $b) => $b['_score'] <=> $a['_score']);

    // Remove internal score field
    $results = array_map(function ($m) {
        unset($m['_score']);
        return $m;
    }, $results);

    echo json_encode([
        'success' => true,
        'query'   => $query,
        'genre'   => $genre,
        'data'    => $results,
        'count'   => count($results),
    ]);
}
