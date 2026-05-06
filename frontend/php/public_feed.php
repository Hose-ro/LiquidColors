<?php
// LEGACY: este feed PHP ya no es la fuente oficial de datos.
// El feed oficial del blog publico debe servirse desde Laravel.

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../db.php';

/**
 * Estructura de salida:
 * {
 *   posts: [{id,title,excerpt,cover_url,created_at,tag}],
 *   notices: [{id,title,body,tag,created_at}],
 *   deliveries: [{created_at,product,quantity,technique,shipping}]
 * }
 */

try {
  // --- Posts publicados (últimos 60) ---
  $stmt = $pdo->prepare("
    SELECT id, title, excerpt, cover_url, created_at,
           NULL as tag
    FROM blog_posts
    WHERE published = 1
    ORDER BY created_at DESC
    LIMIT 60
  ");
  $stmt->execute();
  $posts = $stmt->fetchAll();

  // --- Avisos (últimos 12) ---
  // Requiere tabla 'announcements' (ver SQL más abajo)
  $stmt = $pdo->prepare("
    SELECT id, title, body, tag, created_at
    FROM announcements
    ORDER BY created_at DESC
    LIMIT 12
  ");
  try {
    $stmt->execute();
    $notices = $stmt->fetchAll();
  } catch (Throwable $e) {
    // Si la tabla no existe aún, devolvemos vacío
    $notices = [];
  }

  // --- Entregas de la semana (últimos 7 días) ---
  // Usamos orders creadas últimos 7 días como entregadas (puedes cambiar a delivered_at si lo agregas)
  $stmt = $pdo->prepare("
    SELECT created_at, product, quantity, technique, shipping
    FROM orders
    WHERE created_at >= (NOW() - INTERVAL 7 DAY)
    ORDER BY created_at DESC
    LIMIT 100
  ");
  $stmt->execute();
  $deliveries = $stmt->fetchAll();

  echo json_encode([
    'posts' => $posts,
    'notices' => $notices,
    'deliveries' => $deliveries
  ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
