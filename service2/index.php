<?php
// Simple PHP server handling /status only, printing text/plain
function getStatusRecord() {
    // uptime in hours
    $uptimeContent = trim(shell_exec("cut -d' ' -f1 /proc/uptime"));
    $uptimeHours = floatval($uptimeContent) / 3600.0;

    // free disk in root in MB - directly use df -m to get MB
    $freeMB = intval(trim(shell_exec("df -m --output=avail / | tail -1")));
    
    $timestamp = gmdate("Y-m-d\TH:i:s\Z");
    // Fixed string length and format
    $record = sprintf("Timestamp2 %s: uptime %.2f hours, free disk in root: %d MBytes", 
                     $timestamp, $uptimeHours, $freeMB);
    return $record;
}

function appendVStorage($line) {
    $path = '/app/vstorage';
    if (!file_exists($path)) {
        file_put_contents($path, '');
    }
    file_put_contents($path, $line . "\n", FILE_APPEND);
}

function postToStorage($line) {
    $url = 'http://storage:8300/log';
    $opts = [
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: text/plain\r\n",
            'content' => $line
        ]
    ];
    $context = stream_context_create($opts);
    @file_get_contents($url, false, $context);
}

// Very small router using PHP's built-in server detection
// If run with: php -S 0.0.0.0:8200 index.php
// then this script is invoked for every request.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/status') {
    $record = getStatusRecord();
    appendVStorage($record);
    postToStorage($record);
    header('Content-Type: text/plain');
    // Make sure we send the full content
    echo $record;
    flush();
    exit;
} elseif ($path === '/') {
    header('Content-Type: text/plain');
    echo "Service2 OK";
    exit;
} else {
    http_response_code(404);
    header('Content-Type: text/plain');
    echo "Not Found";
    exit;
}
?>
