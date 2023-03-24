CREATE TABLE brand (
	id_brand int NOT NULL auto_increment,
	brand varchar(32) NOT NULL,
	PRIMARY KEY (id_brand)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE car (
	id_car int NOT NULL auto_increment,
	vin varchar(8) NOT NULL,
	brand varchar(32),
    year int(4),
    color varchar(32) NULL,
    price DECIMAL(12,2),
    car_date DATE,
    car_datetime DATETIME,
    car_boolean tinyint(1),
    comment varchar(512),
	id_brand int,
	PRIMARY KEY (id_car)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE country (
	id_country int NOT NULL auto_increment,
	code varchar(8) NOT NULL,
	name varchar(32) NOT NULL,
	PRIMARY KEY (id_country)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE drive (
	id_drive int NOT NULL auto_increment,
	city_from varchar(32) NOT NULL,
	city_to varchar(32),
    km int,
    fuel_price DECIMAL(12,2),
    drive_date DATE,
    drive_datetime DATETIME,
    drive_boolean tinyint(1),
	id_car int NOT NULL,
	id_country int,
	PRIMARY KEY (id_drive)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

/* poznamocka */
/*ALTER TABLE car ADD id_brand int AFTER color;*/

ALTER TABLE car ADD CONSTRAINT car_brand FOREIGN KEY (id_brand) REFERENCES brand (id_brand);
ALTER TABLE drive ADD CONSTRAINT drive_car FOREIGN KEY (id_car) REFERENCES car (id_car);
ALTER TABLE drive ADD CONSTRAINT drive_country FOREIGN KEY (id_country) REFERENCES country (id_country);
