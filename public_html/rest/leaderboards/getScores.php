<?php

include "config.php";

$conn = new PDO("mysql:host=$dbHost;dbname=$dbDatabase", $dbUsername, $dbPassword);

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$insertScoreStmt = $conn->prepare("select name, score from scores order by score desc ");

$insertScoreStmt->execute();

while($row = $insertScoreStmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row["name"] . "<br>,";
}