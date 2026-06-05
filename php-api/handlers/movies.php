<?php
require_once __DIR__ . '/../data/movies_data.php';

/**
 * GET  /api/movies          → all movies
 * GET  /api/movies/{id}     → single movie
 * GET  /api/movies/categories → all categories with movies
 */
function handle_movies(string $method, ?string $id): void {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $movies = get_all_movies();

    // /api/movies/categories
    if ($id === 'categories') {
        $categories = get_categories();
        $all_movies = array_column($movies, null, 'id');

        $result = array_map(function ($cat) use ($all_movies) {
            $cat['movies'] = array_values(array_filter(
                array_map(fn($mid) => $all_movies[$mid] ?? null, $cat['movies'])
            ));
            return $cat;
        }, $categories);

        echo json_encode(['success' => true, 'data' => $result]);
        return;
    }

    // /api/movies/{id}
    if ($id !== null && is_numeric($id)) {
        $movie = null;
        foreach ($movies as $m) {
            if ($m['id'] === (int)$id) {
                $movie = $m;
                break;
            }
        }

        if (!$movie) {
            http_response_code(404);
            echo json_encode(['error' => 'Movie not found']);
            return;
        }

        // Include "similar" movies (same genre)
        $similar = array_values(array_filter($movies, function ($m) use ($movie) {
            return $m['id'] !== $movie['id'] &&
                   !empty(array_intersect($m['genre'], $movie['genre']));
        }));

        echo json_encode([
            'success' => true,
            'data'    => $movie,
            'similar' => array_slice($similar, 0, 4),
        ]);
        return;
    }

    // /api/movies — return all with pagination
    $page     = max(1, (int)($_GET['page'] ?? 1));
    $per_page = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
    $genre    = $_GET['genre'] ?? null;

    if ($genre) {
        $movies = array_values(array_filter(
            $movies,
            fn($m) => in_array(strtolower($genre), array_map('strtolower', $m['genre']))
        ));
    }

    $total  = count($movies);
    $offset = ($page - 1) * $per_page;
    $paged  = array_slice($movies, $offset, $per_page);

    echo json_encode([
        'success'    => true,
        'data'       => $paged,
        'pagination' => [
            'page'       => $page,
            'per_page'   => $per_page,
            'total'      => $total,
            'total_pages'=> ceil($total / $per_page),
        ],
    ]);
}
