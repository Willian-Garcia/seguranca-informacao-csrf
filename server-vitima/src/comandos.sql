-- Estrutura inicial do banco de dados:
DROP TABLE IF EXISTS users, contacts;
CREATE TABLE users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(100) NOT NULL
);

CREATE TABLE contacts (
	id SERIAL NOT NULL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	name VARCHAR(50) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	FOREIGN KEY (user_id) 
		REFERENCES users(id) 
		ON DELETE CASCADE 
		ON UPDATE CASCADE
);

INSERT INTO users (username, password) VALUES
	('ana', '123'),
	('pedro', '456'),
	('maria', '789');

INSERT INTO contacts (user_id, name, phone) VALUES
	(1, 'João', '12988776655'),
	(1, 'Carla', '12922334455'),
	(2, 'Marcela', '11955443322'),
	(2, 'Roberto', '19999887766'),
	(3, 'Lucas', '11944558899');