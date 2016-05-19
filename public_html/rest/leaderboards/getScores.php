<?php

include "config.php";

$conn = new PDO("mysql:host=$dbHost;dbname=$dbDatabase", $dbUsername, $dbPassword);

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$insertScoreStmt = $conn->prepare("select name, score from scores order by score desc limit 10");

$insertScoreStmt->execute();

echo '{"scores": [';
$first = true;
while($row = $insertScoreStmt->fetch(PDO::FETCH_ASSOC)) {
    if(!$first)
        echo ",";
    
    echo "{";
    echo '"name": "' . $row["name"] . '",';
    echo '"score": ' . $row["score"];
    echo "}";
    
    $first = false;
}

echo "]}";