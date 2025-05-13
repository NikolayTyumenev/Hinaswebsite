<?php
// Set headers to prevent caching and allow CORS
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Check if this is a preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Constants
define('DATA_DIR', __DIR__ . '/journal_data/');
define('AUTH_FILE', DATA_DIR . 'auth.json');
define('USERNAME', 'Hina');
define('PASSWORD_HASH', password_hash('HinaMajboor123!', PASSWORD_DEFAULT));

// Create data directory if it doesn't exist
if (!file_exists(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Initialize auth file if it doesn't exist
if (!file_exists(AUTH_FILE)) {
    $authData = [
        'username' => USERNAME,
        'password_hash' => PASSWORD_HASH
    ];
    file_put_contents(AUTH_FILE, json_encode($authData));
}

// Get the request data
$requestData = json_decode(file_get_contents('php://input'), true);

// Check if the request includes auth data
$isAuthenticated = false;
if (isset($requestData['auth'])) {
    $username = $requestData['auth']['username'];
    $password = $requestData['auth']['password'];
    
    // Verify credentials
    $authData = json_decode(file_get_contents(AUTH_FILE), true);
    if ($username === $authData['username'] && password_verify($password, $authData['password_hash'])) {
        $isAuthenticated = true;
    }
}

// Process the request based on action
$action = isset($requestData['action']) ? $requestData['action'] : '';
$response = ['success' => false, 'message' => 'Invalid action'];

switch ($action) {
    case 'login':
        // Login attempt
        if ($isAuthenticated) {
            $response = [
                'success' => true,
                'message' => 'Login successful'
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'Invalid credentials'
            ];
        }
        break;
        
    case 'save':
        // Save data to the server
        if ($isAuthenticated) {
            $dataType = isset($requestData['dataType']) ? $requestData['dataType'] : '';
            $data = isset($requestData['data']) ? $requestData['data'] : null;
            
            if (!empty($dataType) && $data !== null) {
                $filename = DATA_DIR . sanitizeFilename($dataType) . '.json';
                file_put_contents($filename, json_encode($data));
                
                $response = [
                    'success' => true,
                    'message' => 'Data saved successfully'
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Invalid data type or data'
                ];
            }
        } else {
            $response = [
                'success' => false,
                'message' => 'Authentication required'
            ];
        }
        break;
        
    case 'load':
        // Load data from the server
        $dataType = isset($requestData['dataType']) ? $requestData['dataType'] : '';
        
        if (!empty($dataType)) {
            $filename = DATA_DIR . sanitizeFilename($dataType) . '.json';
            
            if (file_exists($filename)) {
                $data = json_decode(file_get_contents($filename), true);
                
                $response = [
                    'success' => true,
                    'data' => $data
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'No data found'
                ];
            }
        } else {
            $response = [
                'success' => false,
                'message' => 'Invalid data type'
            ];
        }
        break;
        
    case 'backup':
        // Create a backup of all data
        if ($isAuthenticated) {
            $backupData = [];
            $files = glob(DATA_DIR . '*.json');
            
            foreach ($files as $file) {
                $basename = basename($file, '.json');
                if ($basename !== 'auth') {
                    $backupData[$basename] = json_decode(file_get_contents($file), true);
                }
            }
            
            $response = [
                'success' => true,
                'data' => $backupData,
                'timestamp' => time()
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'Authentication required'
            ];
        }
        break;
        
    case 'restore':
        // Restore data from backup
        if ($isAuthenticated) {
            $backupData = isset($requestData['data']) ? $requestData['data'] : null;
            
            if ($backupData !== null) {
                foreach ($backupData as $dataType => $data) {
                    if ($dataType !== 'auth') {
                        $filename = DATA_DIR . sanitizeFilename($dataType) . '.json';
                        file_put_contents($filename, json_encode($data));
                    }
                }
                
                $response = [
                    'success' => true,
                    'message' => 'Data restored successfully'
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Invalid backup data'
                ];
            }
        } else {
            $response = [
                'success' => false,
                'message' => 'Authentication required'
            ];
        }
        break;
}

// Helper function to sanitize filenames
function sanitizeFilename($filename) {
    // Remove any characters that aren't alphanumeric or underscores
    return preg_replace('/[^a-z0-9_]/i', '', $filename);
}

// Return the response as JSON
echo json_encode($response);
?>