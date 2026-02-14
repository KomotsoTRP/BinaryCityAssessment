<?php
// Database config scipt

class Database
{
    private $host = 'localhost';
    private $dbname = 'your_database';
    private $username = 'your_username';
    private $password = 'your_password';
    private $conn;

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->dbname,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database connection failed']);
            exit;
        }

        return $this->conn;
    }
}
?>