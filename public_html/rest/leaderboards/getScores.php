<?php

include "config.php";

$conn = new PDO("mysql:host=$dbHost;dbname=$dbDatabase", $dbUsername, $dbPassword);

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$insertScoreStmt = $conn->prepare("INSERT INTO scores (name, score, level) VALUES (:name, :score, :level)");

$insertScoreStmt->bindParam(':name', $_GET["name"]);
$insertScoreStmt->bindParam(':score', $_GET["score"]);
$insertScoreStmt->bindParam(':level', $_GET["level"]);

$insertScoreStmt->execute();

while($row = $insertScoreStmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row["name"];
}