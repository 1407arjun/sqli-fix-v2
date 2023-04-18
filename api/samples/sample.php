<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM orders WHERE order_date >= '$start_date' AND order_total < $max_total AND order_status = $status AND order_id IN ($order_ids) AND order_amount BETWEEN :min_amount AND $max_amount AND customer_id = $customer_id AND order_is_active = $is_active";
$conn->query($sql);

$sql = "INSERT INTO MyGuests (firstname, lastname, email) VALUES ('John', 'Doe', 'john@example.com')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$sql = "INSERT INTO tablename (firstname, lastname) VALUES ('John', 'Doe')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$name = $_POST['name'];
$result = $conn->query("SELECT * FROM mytable WHERE name like '$name'");
while($row = $result->fetch_assoc()) {
  
}

$age = $_POST['age'];
$sessionId = $_SESSION['id'];
$conn->query("UPDATE mytable SET age = $age, isLogin = TRUE WHERE id = '$sessionId'");

$conn->close();
?>
