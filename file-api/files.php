<?php
$file = $_GET['file'] ?? '';
$filePath = 'uploads/' . $file;

// Güvenlik kontrolü
if (empty($file) || !file_exists($filePath)) {
    header('HTTP/1.0 404 Not Found');
    exit('Dosya bulunamadı');
}

// Dosya tipini belirle
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $filePath);
finfo_close($finfo);

// Uygun header'ları ayarla
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($filePath));
header('Content-Disposition: inline; filename="' . basename($file) . '"');

// Dosyayı oku ve gönder
readfile($filePath); 