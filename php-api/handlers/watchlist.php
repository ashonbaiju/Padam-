<?php
/**
 * Watchlist handler — persists to a JSON file (session-based).
 * In production this would use a MySQL database.
 *
 * GET    /api/watchlist          → get current user's list
 * POST   /api/watchlist          → add a movie  { "movie_id": 3 }
 * DELETE /api/watchlist/{id}     → remove a movie
 */

define('WATCHLIST_FILE', __DIR__ . '/../../storage/watchlist.json');

function load_watchlist(): array {
    if (!file_exists(WATCHLIST_FILE)) {
        return [];
    }
    $json = file_get_contents(WATCHLIST_FILE);
    return json_decode($json, true) ?? [];
}

function save_watchlist(array $list): void {
    $dir = dirname(WATCHLIST_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents(WATCHLIST_FILE, json_encode($list, JSON_PRETTY_PRINT));
}

function handle_watchlist(string $method, ?string $id): void {
    $watchlist = load_watchlist();

    switch ($method) {
        case 'GET':
            // Return current watchlist
            require_once __DIR__ . '/../data/movies_data.php';
            $movies = get_all_movies();
            $movie_map = array_column($movies, null, 'id');

            $result = array_values(array_filter(
                array_map(fn($mid) => $movie_map[$mid] ?? null, $watchlist)
            ));

            echo json_encode([
                'success' => true,
                'data'    => $result,
                'count'   => count($result),
            ]);
            break;

        case 'POST':
            // Add to watchlist
            $body = json_decode(file_get_contents('php://input'), true);
            $movie_id = (int)($body['movie_id'] ?? 0);

            if (!$movie_id) {
                http_response_code(400);
                echo json_encode(['error' => 'movie_id is required']);
                return;
            }

            if (!in_array($movie_id, $watchlist)) {
                $watchlist[] = $movie_id;
                save_watchlist($watchlist);
                echo json_encode([
                    'success' => true,
                    'message' => 'Added to watchlist',
                    'movie_id'=> $movie_id,
                    'count'   => count($watchlist),
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'message' => 'Already in watchlist',
                    'movie_id'=> $movie_id,
                    'count'   => count($watchlist),
                ]);
            }
            break;

        case 'DELETE':
            // Remove from watchlist
            $movie_id = (int)($id ?? 0);
            if (!$movie_id) {
                http_response_code(400);
                echo json_encode(['error' => 'movie_id is required']);
                return;
            }

            $watchlist = array_values(array_filter($watchlist, fn($mid) => $mid !== $movie_id));
            save_watchlist($watchlist);

            echo json_encode([
                'success'  => true,
                'message'  => 'Removed from watchlist',
                'movie_id' => $movie_id,
                'count'    => count($watchlist),
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}
