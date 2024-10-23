<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqlis.php');

$sql = 'SELECT `admin_email` FROM `reimbursement_admin`';

$result = $mysqli->query($sql);

if ($result) echo json_encode($result->fetch_assoc()['admin_email']);

mysqli_close($mysqli);
?>