<?php
// Link model API script

header('Content-Type: application/json');

require_once 'config.php';
require_once 'ModelsManager.php';

class LinkModel
{
    private $clientModel;
    private $contactModel;
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
        $this->clientModel = new ClientModel($db);
        $this->contactModel = $this->clientModel->getContactModel();
    }

    public function handleRequest()
    {
        try {
            $action = $_GET['action'] ?? $_POST['action'] ?? null;

            if (!$action) {
                return $this->jsonResponse(false, 'No action specified');
            }

            switch ($action) {
                case 'fetchAll':
                    $data = $this->clientModel->fetchAllClientsWithContacts();
                    return $this->jsonResponse(true, null, $data);

                case 'addClient':
                    $clientName = trim($_POST['clientName'] ?? '');

                    if (empty($clientName)) {
                        return $this->jsonResponse(false, 'Client name is required');
                    }

                    if (strlen($clientName) < 1) {
                        return $this->jsonResponse(false, 'Client name cannot be empty');
                    }

                    if (strlen($clientName) > 150) {
                        return $this->jsonResponse(false, 'Client name exceeds maximum allowed length');
                    }

                    $this->clientModel->addClientOnly($clientName);
                    $data = $this->clientModel->fetchAllClientsWithContacts();
                    return $this->jsonResponse(true, 'Client added successfully', $data);

                case 'addContact':
                    $clientId = trim($_POST['clientId'] ?? '');
                    $firstName = trim($_POST['firstName'] ?? '');
                    $lastName = trim($_POST['lastName'] ?? '');
                    $email = trim($_POST['email'] ?? '');

                    if (empty($clientId) || empty($firstName) || empty($lastName) || empty($email)) {
                        return $this->jsonResponse(false, 'All fields are required');
                    }

                    if (!is_numeric($clientId)) {
                        return $this->jsonResponse(false, 'Invalid client ID');
                    }

                    if (strlen($firstName) < 1 || strlen($lastName) < 1) {
                        return $this->jsonResponse(false, 'Fields cannot be empty');
                    }

                    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        return $this->jsonResponse(false, 'Invalid email format');
                    }

                    if (strlen($firstName) > 100 || strlen($lastName) > 100 || strlen($email) > 150) {
                        return $this->jsonResponse(false, 'Field length exceeded maximum allowed');
                    }

                    $this->contactModel->addContactToClient($clientId, $firstName, $lastName, $email);
                    $data = $this->clientModel->fetchAllClientsWithContacts();
                    return $this->jsonResponse(true, 'Contact added successfully', $data);

                case 'linkContact':
                    $clientId = trim($_POST['clientId'] ?? '');
                    $contactId = trim($_POST['contactId'] ?? '');

                    if (empty($clientId) || empty($contactId)) {
                        return $this->jsonResponse(false, 'Client ID and Contact ID are required');
                    }

                    if (!is_numeric($clientId) || !is_numeric($contactId)) {
                        return $this->jsonResponse(false, 'Invalid client ID or contact ID');
                    }

                    $this->contactModel->linkExistingContact($clientId, $contactId);
                    $data = $this->clientModel->fetchAllClientsWithContacts();
                    return $this->jsonResponse(true, 'Contact linked successfully', $data);

                case 'unlinkClient':
                    $clientId = trim($_GET['clientId'] ?? '');

                    if (empty($clientId)) {
                        return $this->jsonResponse(false, 'Client ID is required');
                    }

                    if (!is_numeric($clientId)) {
                        return $this->jsonResponse(false, 'Invalid client ID');
                    }

                    $this->clientModel->unlinkClient($clientId);
                    $data = $this->clientModel->fetchAllClientsWithContacts();
                    return $this->jsonResponse(true, 'Client unlinked successfully', $data);

                default:
                    return $this->jsonResponse(false, 'Invalid action');
            }
        } catch (Exception $e) {
            return $this->jsonResponse(false, $e->getMessage());
        }
    }

    private function jsonResponse($success, $message, $data = null)
    {
        $response = ['success' => $success];
        
        if ($message !== null) {
            $response['message'] = $message;
        }
        
        if ($data !== null) {
            $response['data'] = $data;
        }

        echo json_encode($response);
        exit;
    }
}

$database = new Database();
$db = $database->getConnection();

$linkModel = new LinkModel($db);
$linkModel->handleRequest();
?>