INSERT INTO users VALUES (1,'hca@gmail.com','$2a$10$HQqUz5vSIfzHuM95S1M3w.','$2a$10$HQqUz5vSIfzHuM95S1M3w.0AIP9HXSHtiHwsFsV6Qog9ZCp.BfZTG','admin',0);
INSERT INTO users VALUES (2,'monty@gmail.com','$2a$10$jvZIysjlBjzoVWWL8i7TPu','$2a$10$jvZIysjlBjzoVWWL8i7TPukvNOFeOjTTf4YqDUThfgSYZj9wP/Xpa','owner',0);
INSERT INTO users VALUES (3,'bill@kaiju.com','$2a$10$5/z6LQw1wcbSp5cvpQ0cDu','$2a$10$5/z6LQw1wcbSp5cvpQ0cDuknYDbBvHGFdS1ZDIvDGSVQKDvVxAVcW','owner',0);
INSERT INTO users VALUES (4,'bob@rs.com','$2a$10$JPmC/zClzMp12T9iZPhpaO','$2a$10$JPmC/zClzMp12T9iZPhpaOa6HI1PUkbozuNea7fzDawfoKCcK9Id.','owner',0);
INSERT INTO users VALUES (5,'will@pai.com','$2a$10$GAuxDpv5sg0UMm.C3ZkkOu','$2a$10$GAuxDpv5sg0UMm.C3ZkkOu0UK2RC2s3gMoEvblA.64OWJ5GzSuO4.','owner',0);
INSERT INTO users VALUES (6,'christmas@expendables.com','$2a$10$NWBeaabiqKucxLJGpBNxmO','$2a$10$NWBeaabiqKucxLJGpBNxmOPzbGAGbYGP4/6P3hVaQPLY7mxh//gQS','customer',0);
INSERT INTO users VALUES (7,'joesoto@td.com','$2a$10$No26sxZ7R2xyAvnNL2QNpe','$2a$10$No26sxZ7R2xyAvnNL2QNpeW1dbS.4y4AyYnoJ8fB7YOreatKnNYNS','customer',0);
INSERT INTO users VALUES (8,'chirsrock@hollywood.com','$2a$10$OBjAKkwgU4GJgCrI1sut6u','$2a$10$OBjAKkwgU4GJgCrI1sut6uGk8vji3N/8S9vyfPovP/ls0CP5agyf2','customer',0);
INSERT INTO users VALUES (9,'zuckerberg@fb.com','$2a$10$k3lEbGW65aZunIxSuolGLO','$2a$10$k3lEbGW65aZunIxSuolGLOs.hw.quc13EGMUIdni2uYxZy7FTvA6i','customer',0);
INSERT INTO users VALUES (10,'thomas@bayern.de','$2a$10$Da19EZuesvRdXZqOvTX4dO','$2a$10$Da19EZuesvRdXZqOvTX4dOVe.m3IRNUTGcdC4MfWpdE4/cHOF9u8q','customer',0);

INSERT INTO owners VALUES (1,'Monty','Singh','2017-02-16',4167822931,'','active',2);
INSERT INTO owners VALUES (2,'Bill','Xiu','2017-02-16',4127443512,'','active', 3);
INSERT INTO owners VALUES (3,'Bob','Thames','2017-02-16',4124135221,'','active', 4);
INSERT INTO owners VALUES (4,'Will','Homes','2017-02-16',4124153512,'','active', 5);

INSERT INTO restaurants VALUES (1,'Riddle Room','579 Yonge Street','Toronto','Ontario','Canada','M4Y1Z2',6473442637,'','active',NULL,NULL,5.00,NULL,1);
INSERT INTO restaurants VALUES (2,'Kaiju','384 Yonge Street','Toronto','Ontario','Canada','M5B241',6477486338,'','active',NULL,NULL,5.00,NULL,2);
INSERT INTO restaurants VALUES (3,'Richmond Station','1 Richmond Street W','Toronto','Ontario','Canada','M5H3W4',6477481444,'','active',NULL,NULL,5.00,NULL,3);
INSERT INTO restaurants VALUES (4,'PAI','18 Duncan Street','Toronto','Ontario','Canada','M5H3G6',4169014724,'','active',NULL,NULL,5.00,NULL,4);

INSERT INTO meals VALUES (1,'Chocolate Milkshake','Amazingly Good','Chocolate, Milk, Sugar',5.0,'',1,1);
INSERT INTO meals VALUES (2,'Pizza Panini','You gotta have this one','Veggies, Tomato, Chicken',8.0,'',0,1);
INSERT INTO meals VALUES (3,'Malaysian Fried Sambal Udon','Udon noodles stir-fried with homemade sambal sauce, onion, fish balls, and chicken','Sambal sauce, Onions, Fish Balls, Chicken',9.0,'',1,2);
INSERT INTO meals VALUES (4,'Crispy Pepper Chicken','Stir-fried crispy chicken seasoned with freshly ground black pepper', 'Veggies, Chicken, Black Pepper',9.0,'',0,2);
INSERT INTO meals VALUES (5,'Grilled Cornish Hen','Hen stirred in potato sauce.','rutabaga puree, potato pave, truffled celery, carrots, white wine jus, watercress',26.0,'',1,3);
INSERT INTO meals VALUES (6,'Station Burger','Burger that is in a station.','lettuce, beet chutney, aged cheddar, milk bun, rosemary fries, dill pickle, garlic aioli',21.0,'',0,3);
INSERT INTO meals VALUES (7,'Khao Soi with braised beef','Fresh egg noodles in a golden curry topped with crispy noodles, coriander, green onions and braised beef (contains shrimp paste)','shrimp paste, beef, noodles, coriander, green onions',13.0,'',1,4);
INSERT INTO meals VALUES (8,'Fried Fish with Green Curry sauce and Rice','Crispy Basa Fillet with crispy shallots served with green curry sauce and rice. (contains oyster sauce)', 'fish, shallots, green curry sauce, rice, oyster sauce',13.0,'',0,4);

INSERT INTO payment_plans VALUES (1,'The 12','Its simple.. You get 12 meals.','',8.25, 12, 'active','the-12');
INSERT INTO payment_plans VALUES (2,'The 20','And for this one, you get 20!','',7.45, 20, 'active', 'the-20');
INSERT INTO payment_plans VALUES (3,'The 5','5 Lunches to try out our society!','',8, 20, 'active', 'the-5');

INSERT INTO customers VALUES (1,'Christmas','Carter','2017-02-01','2017-02-28','2017-02-16',10,'M5V2J2','','active',0,NULL,'','',6,1);
INSERT INTO customers VALUES (2,'Joe','Soto','2017-02-01','2017-02-28','2017-02-17',20,'M5V2J2','','active',0,NULL,'','',7,2);
INSERT INTO customers VALUES (3,'Chris','Rock','2017-02-01','2017-02-28','2017-02-18',10,'M5V2J2','','active',0,NULL,'','',8,1);
INSERT INTO customers VALUES (4,'Mark','Zuckerberg','2017-02-01','2017-02-28','2017-02-19',20,'M5V2J2','','active',0,NULL,'','',9,2);
INSERT INTO customers VALUES (5,'Thomas','Muller','2017-02-01','2017-02-28','2017-02-20',20,'M5V2J2','','active',0,NULL,'','',10,2);

INSERT INTO invoices VALUES (1,'2017-02-01','paid',8.0,60.0,'',1);
INSERT INTO invoices VALUES (2,'2017-02-01','paid',15.0,120.0,'',2);
INSERT INTO invoices VALUES (3,'2017-02-01','paid',8.0,60.0,'',3);
INSERT INTO invoices VALUES (4,'2017-02-01','paid',15.0,120.0,'',4);
INSERT INTO invoices VALUES (5,'2017-02-01','paid',15.0,120.0,'',5);

INSERT INTO pickup_times VALUES (1,'11:30 AM to 11:45 AM');
INSERT INTO pickup_times VALUES (2,'11:45 AM to 12:00 PM');
INSERT INTO pickup_times VALUES (3,'12:00 PM to 12:15 PM');
INSERT INTO pickup_times VALUES (4,'12:15 PM to 12:30 PM');
INSERT INTO pickup_times VALUES (5,'12:30 PM to 12:45 PM');
INSERT INTO pickup_times VALUES (6,'12:45 PM to 13:00 PM');
INSERT INTO pickup_times VALUES (7,'13:00 PM to 13:15 PM');
INSERT INTO pickup_times VALUES (8,'13:15 PM to 13:30 PM');

INSERT INTO offers VALUES (1,'2017-02-16',40,40,'completed',4);
INSERT INTO offers VALUES (2,'2017-02-17',30,28,'completed',2);
INSERT INTO offers VALUES (3,'2017-02-17',30,27,'completed',3);
INSERT INTO offers VALUES (4,'2017-02-21',35,35,'completed',4);

INSERT INTO orders VALUES (1,'2017-02-17','completed',2,3,1);
INSERT INTO orders VALUES (2,'2017-02-17','completed',3,2,2);
INSERT INTO orders VALUES (3,'2017-02-17','completed',2,5,3);
INSERT INTO orders VALUES (4,'2017-02-17','completed',3,5,4);
INSERT INTO orders VALUES (5,'2017-02-17','completed',3,6,5);

INSERT INTO feedbacks VALUES (1,'Meal was very  good!',5,5,5,1);
INSERT INTO feedbacks VALUES (2,'Terrible Meal. Salad was dry and stale.',2,3,2,2);
INSERT INTO feedbacks VALUES (3,'Portion size was good. Yummy!',5,5,5,3);
INSERT INTO feedbacks VALUES (4,'',5,4,4,4);
INSERT INTO feedbacks VALUES (5,'Loved It!',5,5,5,5);

INSERT INTO weeks VALUES (1,'Week 01 - 02','02-Jan-17','15-Jan-17',2017);
INSERT INTO weeks VALUES (2,'Week 03 - 04','16-Jan-17','29-Jan-17',2017);
INSERT INTO weeks VALUES (3,'Week 05 - 06','30-Jan-17','12-Feb-17',2017);
INSERT INTO weeks VALUES (4,'Week 07 - 08','13-Feb-17','26-Feb-17',2017);
INSERT INTO weeks VALUES (5,'Week 09 - 10','27-Feb-17','12-Mar-17',2017);
INSERT INTO weeks VALUES (6,'Week 11 - 12','13-Mar-17','26-Mar-17',2017);
INSERT INTO weeks VALUES (7,'Week 13 - 14','27-Mar-17','09-Apr-17',2017);
INSERT INTO weeks VALUES (8,'Week 15 - 16','10-Apr-17','23-Apr-17',2017);
INSERT INTO weeks VALUES (9,'Week 17 - 18','24-Apr-17','07-May-17',2017);
INSERT INTO weeks VALUES (10,'Week 19 - 20','08-May-17','21-May-17',2017);
INSERT INTO weeks VALUES (11,'Week 21 - 22','22-May-17','04-Jun-17',2017);
INSERT INTO weeks VALUES (12,'Week 23 - 24','05-Jun-17','18-Jun-17',2017);
INSERT INTO weeks VALUES (13,'Week 25 - 26','19-Jun-17','02-Jul-17',2017);
INSERT INTO weeks VALUES (14,'Week 27 - 28','03-Jul-17','16-Jul-17',2017);
INSERT INTO weeks VALUES (15,'Week 29 - 30','17-Jul-17','30-Jul-17',2017);
INSERT INTO weeks VALUES (16,'Week 31 - 32','31-Jul-17','13-Aug-17',2017);
INSERT INTO weeks VALUES (17,'Week 33 - 34','14-Aug-17','27-Aug-17',2017);
INSERT INTO weeks VALUES (18,'Week 35 - 36','28-Aug-17','10-Sep-17',2017);
INSERT INTO weeks VALUES (19,'Week 37 - 38','11-Sep-17','24-Sep-17',2017);
INSERT INTO weeks VALUES (20,'Week 39 - 40','25-Sep-17','08-Oct-17',2017);
INSERT INTO weeks VALUES (21,'Week 41 - 42','09-Oct-17','22-Oct-17',2017);
INSERT INTO weeks VALUES (22,'Week 43 - 44','23-Oct-17','05-Nov-17',2017);
INSERT INTO weeks VALUES (23,'Week 45 - 46','06-Nov-17','19-Nov-17',2017);
INSERT INTO weeks VALUES (24,'Week 47 - 48','20-Nov-17','03-Dec-17',2017);
INSERT INTO weeks VALUES (25,'Week 49 - 50','04-Dec-17','17-Dec-17',2017);
INSERT INTO weeks VALUES (26,'Week 51 - 52','18-Dec-17','31-Dec-17',2017);

INSERT INTO payouts VALUES (1,'2017-02-27',2,'created',2.0,16.0,NULL,1,4);
INSERT INTO payouts VALUES (2,'2017-02-27',3,'created',3.0,27.0,NULL,2,4);

