<?php
$uptime = shell_exec("awk '{print $1/3600}' /proc/uptime");
$freeDisk = shell_exec("df --output=avail / | tail -1");
$timestamp = gmdate("Y-m-d\TH:i:s\Z");

$record = "Service2 $timestamp: uptime " . round($uptime, 2) . "h, free disk " . trim($freeDisk) . " KB";
echo $record;
?>
