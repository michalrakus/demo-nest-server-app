-- zmeny v DB
alter table x_user modify password char(60) null;

-- new column disabled
alter table x_user add enabled tinyint(1) default 1;
update x_user set enabled = 1 where 1 = 1;
alter table x_user modify enabled tinyint(1) not null default 1;
