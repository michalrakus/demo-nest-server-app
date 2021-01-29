CREATE TABLE brand (
	id_brand int NOT NULL auto_increment,
	brand varchar(32),
	PRIMARY KEY (id_brand)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE car (
	id_car int NOT NULL auto_increment,
	vin varchar(8),
	brand varchar(32),
    year varchar(4),
    color varchar(32) NULL,
    price DECIMAL(12,2),
    car_date DATE,
    car_datetime DATETIME,
	id_brand int,
	PRIMARY KEY (id_car)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE country (
	id_country int NOT NULL auto_increment,
	code varchar(8),
	name varchar(32),
	PRIMARY KEY (id_country)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE drive (
	id_drive int NOT NULL auto_increment,
	city_from varchar(32),
	city_to varchar(32),
    km int,
    fuel_price DECIMAL(12,2),
    drive_date DATE,
    drive_datetime DATETIME,
	id_car int NOT NULL,
	id_country int,
	PRIMARY KEY (id_drive)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE x_user (
	id_x_user int NOT NULL auto_increment,
	username varchar(64),
	password varchar(64),
    name varchar(128), -- meno a priezvisko
	PRIMARY KEY (id_x_user)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE INDEX x_user_username_idx ON x_user (username);

/* poznamocka */
/*ALTER TABLE car ADD id_brand int AFTER color;*/

ALTER TABLE car ADD CONSTRAINT car_brand FOREIGN KEY (id_brand) REFERENCES brand (id_brand);
ALTER TABLE drive ADD CONSTRAINT drive_car FOREIGN KEY (id_car) REFERENCES car (id_car);
ALTER TABLE drive ADD CONSTRAINT drive_country FOREIGN KEY (id_country) REFERENCES country (id_country);

ALTER TABLE car ADD car_date DATE;
ALTER TABLE car ADD car_datetime DATETIME;

ALTER TABLE drive ADD drive_date DATE;
ALTER TABLE drive ADD drive_datetime DATETIME;

insert into x_user (id_x_user, username, password, name)
values
(1, 'test','test','Test user'),
(2, 'rakus','xxx','Mišo'),
(3, 'jozko','xxx','Jožko Mrkvička');

insert into drive (id_drive, city_from, city_to, km, id_car, id_country)
values
(1, 'Bratislava', 'Kosice', 500, 4, 1),
(2, 'Vieden', 'Linz', 400, 4, 8),
(3, 'Praha', 'Brno', 200, 4, 2);

insert into country (id_country, code, name)
values
(1, 'SK', 'Slovensko'),
(2, 'CZ', 'Ceska republika'),
(3, 'D', 'Nemecko'),
(4, 'F', 'Francuzsko'),
(5, 'GB', 'Velka Britania'),
(6, 'PL', 'Polsko'),
(7, 'H', 'Madarsko'),
(8, 'AT', 'Rakusko');
