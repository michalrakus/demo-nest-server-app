-- zmeny v DB
alter table x_user modify password char(60) null;

-- new column disabled
alter table x_user add enabled tinyint(1) default 1;
update x_user set enabled = 1 where 1 = 1;
alter table x_user modify enabled tinyint(1) not null default 1;

-- car_owner + car_owner_file
CREATE TABLE car_owner (
    id int NOT NULL auto_increment,
    name varchar(32),
    surname varchar(32) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- subor (pdf, jpg, ...) ulozime do samostatnej tabulky aby sme mohli pouzivat (select * from car_owner)
-- MEDIUMBLOB has limit 16.78 MB
CREATE TABLE car_owner_file (
    id int NOT NULL auto_increment,
    filename varchar(256) NOT NULL,
    data MEDIUMBLOB NOT NULL,
    car_owner_id int NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

ALTER TABLE car_owner_file ADD CONSTRAINT car_owner_file_car_owner FOREIGN KEY (car_owner_id) REFERENCES car_owner (id);

alter table car add comment varchar(512);
