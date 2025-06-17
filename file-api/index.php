<?php
// Hata ayıklama
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Sunucu bilgilerini logla
error_log("Server Name: " . $_SERVER['SERVER_NAME']);
error_log("Request URI: " . $_SERVER['REQUEST_URI']);
error_log("Document Root: " . $_SERVER['DOCUMENT_ROOT']);
error_log("Script Filename: " . $_SERVER['SCRIPT_FILENAME']);

// Gelen isteği logla
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Content Type: " . $_SERVER['CONTENT_TYPE']);
error_log("POST Data: " . print_r($_POST, true));
error_log("FILES Data: " . print_r($_FILES, true));

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Uploads klasörünü oluştur
if (!file_exists('uploads')) {
    mkdir('uploads', 0777, true);
}

// API endpoint'i için
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Dosya kontrolü
        if (!isset($_FILES['file'])) {
            throw new Exception('Dosya bulunamadı');
        }

        $file = $_FILES['file'];
        
        // Hata kontrolü
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Dosya yükleme hatası: ' . $file['error']);
        }

        // Dosya boyutu kontrolü (10MB)
        if ($file['size'] > 10 * 1024 * 1024) {
            throw new Exception('Dosya boyutu çok büyük. Maksimum 10MB olabilir.');
        }

        // Dosya tipi kontrolü
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            throw new Exception('Geçersiz dosya tipi');
        }

        // Benzersiz dosya adı oluştur
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '-' . time() . '.' . $extension;
        $uploadPath = 'uploads/' . $filename;

        // Dosyayı yükle
        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            throw new Exception('Dosya yüklenirken bir hata oluştu');
        }

        // CDN URL'sini oluştur
        $cdnDomain = 'https://cdn.api.heda.tr/files';
        $fileUrl = $cdnDomain . '/' . $filename;

        // Başarılı yanıt
        echo json_encode([
            'success' => true,
            'url' => $fileUrl,
            'filename' => $filename
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    // API dokümantasyon sayfası
    ?>
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HEDA File API</title>
        <style>
            :root {
                --primary-color: #2563eb;
                --secondary-color: #1e40af;
                --text-color: #1f2937;
                --bg-color: #f3f4f6;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: var(--text-color);
                background-color: var(--bg-color);
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
            }
            
            header {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                padding: 2rem 0;
                margin-bottom: 2rem;
                border-radius: 0 0 1rem 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .header-content {
                text-align: center;
            }
            
            h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            
            .subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
            }
            
            .card {
                background: white;
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            .endpoint {
                background: #f8fafc;
                padding: 1rem;
                border-radius: 0.25rem;
                margin: 1rem 0;
                font-family: monospace;
            }
            
            .method {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-weight: bold;
                margin-right: 0.5rem;
            }
            
            .method.post {
                background: #10b981;
                color: white;
            }
            
            .method.get {
                background: #3b82f6;
                color: white;
            }
            
            .example {
                background: #1e293b;
                color: #e2e8f0;
                padding: 1rem;
                border-radius: 0.25rem;
                margin: 1rem 0;
                overflow-x: auto;
            }
            
            .example pre {
                font-family: monospace;
                white-space: pre-wrap;
            }
            
            .response {
                margin-top: 1rem;
            }
            
            .response-title {
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            
            .try-it {
                text-align: center;
                margin-top: 2rem;
            }
            
            .try-it-button {
                display: inline-block;
                background: var(--primary-color);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 0.25rem;
                text-decoration: none;
                font-weight: bold;
                transition: background 0.3s;
            }
            
            .try-it-button:hover {
                background: var(--secondary-color);
            }
            
            footer {
                text-align: center;
                margin-top: 3rem;
                padding: 1rem;
                color: #6b7280;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <div class="header-content">
                    <h1>HEDA File API</h1>
                    <p class="subtitle">Dosya yükleme ve CDN hizmeti</p>
                </div>
            </div>
        </header>
        
        <div class="container">
            <div class="card">
                <h2>Dosya Yükleme</h2>
                <p>Dosyaları yüklemek için aşağıdaki endpoint'i kullanabilirsiniz.</p>
                
                <div class="endpoint">
                    <span class="method post">POST</span> /index.php
                </div>
                
                <h3>İstek</h3>
                <div class="example">
                    <pre>curl -X POST -F "file=@dosya.jpg" http://cdn.api.heda.tr/index.php</pre>
                </div>
                
                <h3>Örnek Yanıt</h3>
                <div class="example">
                    <pre>{
    "success": true,
    "url": "http://cdn.api.heda.tr/files/1234567890-dosya.jpg",
    "filename": "1234567890-dosya.jpg"
}</pre>
                </div>
            </div>
            
            <div class="card">
                <h2>Dosya Görüntüleme</h2>
                <p>Yüklenen dosyaları görüntülemek için aşağıdaki endpoint'i kullanabilirsiniz.</p>
                
                <div class="endpoint">
                    <span class="method get">GET</span> /files.php?file=filename.jpg
                </div>
                
                <h3>Örnek</h3>
                <div class="example">
                    <pre>http://cdn.api.heda.tr/files.php?file=1234567890-dosya.jpg</pre>
                </div>
            </div>
            
            <div class="try-it">
                <a href="https://www.postman.com/" target="_blank" class="try-it-button">Postman ile Test Et</a>
            </div>
        </div>
        
        <footer>
            <p>&copy; <?php echo date('Y'); ?> HEDA File API. Tüm hakları saklıdır.</p>
        </footer>
    </body>
    </html>
    <?php
} 