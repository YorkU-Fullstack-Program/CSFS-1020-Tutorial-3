CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT null,
	age INT NOT null,
	username VARCHAR(255) NOT null,
	password VARCHAR(255) NOT null,
	session_uuid VARCHAR(255) NOT null
);