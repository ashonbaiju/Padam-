<?php
/**
 * Simple auth handler — demo login/register (no real DB).
 * Profiles are stored in a JSON file for demo purposes.
 *
 * POST /api/auth/login      { "email": "...", "password": "..." }
 * POST /api/auth/register   { "name": "...", "email": "...", "password": "..." }
 * POST /api/auth/logout
 * GET  /api/auth/me         → current session user
 */

define('USERS_FILE', __DIR__ . '/../../storage/users.json');

function load_users(): array {
    if (!file_exists(USERS_FILE)) return [];
    return json_decode(file_get_contents(USERS_FILE), true) ?? [];
}

function save_users(array $users): void {
    $dir = dirname(USERS_FILE);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    file_put_contents(USERS_FILE, json_encode($users, JSON_PRETTY_PRINT));
}

function handle_auth(string $method): void {
    session_start();

    $uri      = $_SERVER['REQUEST_URI'];
    $action   = basename(parse_url($uri, PHP_URL_PATH));
    $body     = json_decode(file_get_contents('php://input'), true) ?? [];

    switch ($action) {
        // ── GET /api/auth/me ─────────────────────────────────────
        case 'me':
            if ($method !== 'GET') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); return; }
            if (empty($_SESSION['user'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Not authenticated']);
                return;
            }
            echo json_encode(['success' => true, 'data' => $_SESSION['user']]);
            break;

        // ── POST /api/auth/login ──────────────────────────────────
        case 'login':
            if ($method !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); return; }

            $email    = strtolower(trim($body['email'] ?? ''));
            $password = $body['password'] ?? '';

            if (!$email || !$password) {
                http_response_code(400);
                echo json_encode(['error' => 'Email and password are required']);
                return;
            }

            // Demo: accept test@streamflix.com / password123
            $demo_ok = ($email === 'test@streamflix.com' && $password === 'password123');
            $users   = load_users();
            $found   = null;

            foreach ($users as $u) {
                if ($u['email'] === $email && password_verify($password, $u['password_hash'])) {
                    $found = $u;
                    break;
                }
            }

            if (!$found && !$demo_ok) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid email or password']);
                return;
            }

            $user = $found ?? [
                'id'    => 'demo-001',
                'name'  => 'Demo User',
                'email' => 'test@streamflix.com',
                'plan'  => 'Premium',
            ];

            unset($user['password_hash']);
            $_SESSION['user'] = $user;

            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'data'    => $user,
            ]);
            break;

        // ── POST /api/auth/register ───────────────────────────────
        case 'register':
            if ($method !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); return; }

            $name     = trim($body['name'] ?? '');
            $email    = strtolower(trim($body['email'] ?? ''));
            $password = $body['password'] ?? '';

            if (!$name || !$email || !$password) {
                http_response_code(400);
                echo json_encode(['error' => 'Name, email, and password are required']);
                return;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid email address']);
                return;
            }

            if (strlen($password) < 6) {
                http_response_code(400);
                echo json_encode(['error' => 'Password must be at least 6 characters']);
                return;
            }

            $users = load_users();

            // Check duplicate
            foreach ($users as $u) {
                if ($u['email'] === $email) {
                    http_response_code(409);
                    echo json_encode(['error' => 'Email already registered']);
                    return;
                }
            }

            $new_user = [
                'id'            => uniqid('user-', true),
                'name'          => $name,
                'email'         => $email,
                'password_hash' => password_hash($password, PASSWORD_BCRYPT),
                'plan'          => 'Basic',
                'created_at'    => date('c'),
            ];

            $users[] = $new_user;
            save_users($users);

            unset($new_user['password_hash']);
            $_SESSION['user'] = $new_user;

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Account created successfully',
                'data'    => $new_user,
            ]);
            break;

        // ── POST /api/auth/logout ─────────────────────────────────
        case 'logout':
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logged out']);
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Auth endpoint not found']);
            break;
    }
}
