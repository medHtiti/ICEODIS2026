<?php
// Simple global visitor counter API
// Methods:
//   GET  -> returns current count: { count: <int> }
//   POST -> increments count once and returns new count: { count: <int> }
// Storage: a plain text file with an integer. Uses file locks to avoid races.
// Note: Ensure the web server user has write permissions to this directory or move the data file to a writable directory.

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// You can change this path if you prefer a subdirectory.
$dataFile = __DIR__ . DIRECTORY_SEPARATOR . 'counter.txt';

// Ensure file exists with 0 if not present
if (!file_exists($dataFile)) {
    // Attempt to create the file atomically
    @file_put_contents($dataFile, "0", LOCK_EX);
}

function readCount($file) {
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return 0;
    }
    // Shared lock for reading
    if (!flock($fp, LOCK_SH)) {
        fclose($fp);
        return 0;
    }
    $size = filesize($file);
    if ($size === 0) {
        $data = '0';
    } else {
        $data = fread($fp, $size);
    }
    $count = intval(trim($data));
    flock($fp, LOCK_UN);
    fclose($fp);
    return $count;
}

function writeCount($file, $count) {
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return false;
    }
    if (!flock($fp, LOCK_EX)) { // exclusive lock for write
        fclose($fp);
        return false;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, strval($count));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

if ($method === 'POST') {
    // Optional: very light anti-abuse. Limit same IP increments within short window.
    // Disabled by default; uncomment if needed.
    // $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    // $ttlSeconds = 30; // one increment per 30 seconds per IP
    // $cacheFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'counter_' . preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $ip) . '.tmp';
    // $now = time();
    // if (file_exists($cacheFile)) {
    //     $last = intval(@file_get_contents($cacheFile));
    //     if ($now - $last < $ttlSeconds) {
    //         // Too soon; just return current count without increment
    //         echo json_encode([ 'count' => readCount($dataFile) ]);
    //         exit;
    //     }
    // }

    $count = readCount($dataFile);
    $count = $count + 1;
    writeCount($dataFile, $count);

    // @file_put_contents($cacheFile, (string)$now);

    echo json_encode([ 'count' => $count ]);
    exit;
}

// Default: ????GET -> return current count
$count = readCount($dataFile);
echo json_encode([ 'count' => $count ]);
