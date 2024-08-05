CREATE DATABASE user_statistics;

CREATE TABLE statistics(
    id INT PRIMARY KEY AUTO_INCREMENT,
    path TEXT NOT NULL,
    SIZE BIGINT NOT NULL,
    load_time FLOAT NOT NULL,
    request_time DATETIME NOT NULL
);