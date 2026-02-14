<?php
// Models manager

class ContactModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function findOrCreateContact($firstName, $lastName, $email)
    {
        $sql = "SELECT id FROM contacts WHERE email = :email";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':email' => $email]);
        $contactId = $stmt->fetchColumn();

        if ($contactId) {
            return $contactId;
        }

        $insertSql = "INSERT INTO contacts (first_name, last_name, email) VALUES (:first_name, :last_name, :email)";
        $insertStmt = $this->db->prepare($insertSql);
        $insertStmt->execute([
            ':first_name' => $firstName,
            ':last_name' => $lastName,
            ':email' => $email
        ]);

        return $this->db->lastInsertId();
    }

    public function addContactToClient($clientId, $firstName, $lastName, $email)
    {
        try {
            $this->db->beginTransaction();

            $contactId = $this->findOrCreateContact($firstName, $lastName, $email);

            $checkSql = "SELECT COUNT(*) FROM client_contact_links WHERE client_id = :client_id AND contact_id = :contact_id";
            $checkStmt = $this->db->prepare($checkSql);
            $checkStmt->execute([
                ':client_id' => $clientId,
                ':contact_id' => $contactId
            ]);

            if ($checkStmt->fetchColumn() == 0) {
                $linkSql = "INSERT INTO client_contact_links (client_id, contact_id) VALUES (:client_id, :contact_id)";
                $linkStmt = $this->db->prepare($linkSql);
                $linkStmt->execute([
                    ':client_id' => $clientId,
                    ':contact_id' => $contactId
                ]);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw new Exception('Failed to add contact to client: ' . $e->getMessage());
        }
    }

    public function linkExistingContact($clientId, $contactId)
    {
        try {
            $checkSql = "SELECT COUNT(*) FROM client_contact_links WHERE client_id = :client_id AND contact_id = :contact_id";
            $checkStmt = $this->db->prepare($checkSql);
            $checkStmt->execute([
                ':client_id' => $clientId,
                ':contact_id' => $contactId
            ]);

            if ($checkStmt->fetchColumn() == 0) {
                $linkSql = "INSERT INTO client_contact_links (client_id, contact_id) VALUES (:client_id, :contact_id)";
                $linkStmt = $this->db->prepare($linkSql);
                $linkStmt->execute([
                    ':client_id' => $clientId,
                    ':contact_id' => $contactId
                ]);
            }

            return true;
        } catch (Exception $e) {
            throw new Exception('Failed to link contact: ' . $e->getMessage());
        }
    }
}

class ClientModel
{
    private $db;
    private $contactModel;

    public function __construct($db)
    {
        $this->db = $db;
        $this->contactModel = new ContactModel($db);
    }

    public function fetchAllClientsWithContacts()
    {
        try {
            $sql = "
                SELECT 
                    c.id as client_id,
                    c.name as client_name,
                    c.client_code,
                    con.id as contact_id,
                    con.first_name,
                    con.last_name,
                    con.email
                FROM clients c
                LEFT JOIN client_contact_links ccl ON c.id = ccl.client_id
                LEFT JOIN contacts con ON ccl.contact_id = con.id
                ORDER BY c.id, con.id
            ";

            $stmt = $this->db->query($sql);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $contactLinksCountSql = "
                SELECT contact_id, COUNT(*) as links_count
                FROM client_contact_links
                GROUP BY contact_id
            ";
            $stmt = $this->db->query($contactLinksCountSql);
            $contactLinksCounts = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

            $clients = [];
            $currentClientId = null;
            $currentClient = null;

            foreach ($rows as $row) {
                if ($currentClientId !== $row['client_id']) {
                    if ($currentClient !== null) {
                        $clients[] = $currentClient;
                    }

                    $currentClientId = $row['client_id'];
                    $currentClient = [
                        'clientId' => (int)$row['client_id'],
                        'clientName' => $row['client_name'],
                        'clientCode' => $row['client_code'],
                        'contactsQuantity' => 0,
                        'unLinkURL' => '?action=unlinkClient&clientId=' . $row['client_id'],
                        'contactsList' => []
                    ];
                }

                if ($row['contact_id'] !== null) {
                    $currentClient['contactsQuantity']++;
                    $currentClient['contactsList'][] = [
                        'contactId' => (int)$row['contact_id'],
                        'firstName' => $row['first_name'],
                        'lastName' => $row['last_name'],
                        'email' => $row['email'],
                        'linksQuantity' => (int)($contactLinksCounts[$row['contact_id']] ?? 0)
                    ];
                }
            }

            if ($currentClient !== null) {
                $clients[] = $currentClient;
            }

            return $clients;
        } catch (Exception $e) {
            throw new Exception('Failed to fetch clients: ' . $e->getMessage());
        }
    }

    public function addClientOnly($clientName)
    {
        try {
            // Insert client (temp code)
            $tempCode = "TMP" . substr(uniqid(), -3); // e.g., TMPa3f
            $stmt = $this->db->prepare("INSERT INTO clients (name, client_code) VALUES (:name, :code)");
            $stmt->execute([
                ':name' => $clientName,
                ':code' => $tempCode
            ]);

            // Get last inserted ID
            $lastId = $this->db->lastInsertId();

            // Generate client code
            $clientCode = "ABA" . str_pad($lastId, 3, "0", STR_PAD_LEFT);

            // Update client code
            $stmt = $this->db->prepare("UPDATE clients SET client_code = :code WHERE id = :id");
            $stmt->execute([
                ':code' => $clientCode,
                ':id' => $lastId
            ]);

            return $lastId;

        } catch (PDOException $e) {
            // Error handling
            throw new Exception("Failed to add client: " . $e->getMessage());
        }
    }


    /* Deprecated: addClient (older implementation)
    public function addClient($name, $firstName, $lastName, $email)
    {
        try {
            $this->db->beginTransaction();

            $clientCode = $this->generateClientCode($name);

            $sql = "INSERT INTO clients (name, client_code) VALUES (:name, :client_code)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':name' => $name,
                ':client_code' => $clientCode
            ]);

            $clientId = $this->db->lastInsertId();

            $contactId = $this->contactModel->findOrCreateContact($firstName, $lastName, $email);

            $linkSql = "INSERT INTO client_contact_links (client_id, contact_id) VALUES (:client_id, :contact_id)";
            $linkStmt = $this->db->prepare($linkSql);
            $linkStmt->execute([
                ':client_id' => $clientId,
                ':contact_id' => $contactId
            ]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw new Exception('Failed to add client: ' . $e->getMessage());
        }
    }
    */

    public function unlinkClient($clientId)
    {
        try {
            $sql = "DELETE FROM client_contact_links WHERE client_id = :client_id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':client_id' => $clientId]);

            return true;
        } catch (Exception $e) {
            throw new Exception('Failed to unlink client: ' . $e->getMessage());
        }
    }

    private function generateClientCode($name)
    {
        $name = trim($name);
        $words = preg_split('/\s+/', $name);
        
        $prefix = '';
        
        if (count($words) >= 3) {
            $prefix = strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1) . substr($words[2], 0, 1));
        } elseif (count($words) == 2) {
            $prefix = strtoupper(substr($words[0], 0, 2) . substr($words[1], 0, 1));
        } else {
            $singleWord = $words[0];
            if (strlen($singleWord) >= 3) {
                $prefix = strtoupper(substr($singleWord, 0, 3));
            } elseif (strlen($singleWord) == 2) {
                $prefix = strtoupper($singleWord . 'A');
            } elseif (strlen($singleWord) == 1) {
                $prefix = strtoupper($singleWord . 'AA');
            } else {
                $prefix = 'AAA';
            }
        }

        $sql = "SELECT client_code FROM clients WHERE client_code LIKE :prefix ORDER BY client_code DESC LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':prefix' => $prefix . '%']);
        $lastCode = $stmt->fetchColumn();

        if ($lastCode) {
            $numericPart = (int)substr($lastCode, 3);
            $newNumericPart = str_pad($numericPart + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumericPart = '001';
        }

        return $prefix . $newNumericPart;
    }

    public function getContactModel()
    {
        return $this->contactModel;
    }
}
?>