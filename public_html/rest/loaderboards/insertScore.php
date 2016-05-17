<?php

include "config.php";

$conn = new PDO("mysql:host=$dbHost;dbname=$dbDatabase", $dbUsername, $dbPassword);

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$insertScoreStmt = $conn->prepare("INSERT INTO scores (name, score) 
                        VALUES (:name, :score)");

$insertScoreStmt->bindParam(':name', $_POST["name"]);
$insertScoreStmt->bindParam(':score', $_POST["score"]);
$insertScoreStmt->execute();