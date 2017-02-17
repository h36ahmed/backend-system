INSERT INTO users VALUES (1,'hca@gmail.com','$2a$10$HQqUz5vSIfzHuM95S1M3w.','$2a$10$HQqUz5vSIfzHuM95S1M3w.0AIP9HXSHtiHwsFsV6Qog9ZCp.BfZTG','admin','FALSE');
INSERT INTO users VALUES (2,'monty@gmail.com','$2a$10$jvZIysjlBjzoVWWL8i7TPu','$2a$10$jvZIysjlBjzoVWWL8i7TPukvNOFeOjTTf4YqDUThfgSYZj9wP/Xpa','owner','FALSE');
INSERT INTO users VALUES (3,'bill@kaiju.com','$2a$10$5/z6LQw1wcbSp5cvpQ0cDu','$2a$10$5/z6LQw1wcbSp5cvpQ0cDuknYDbBvHGFdS1ZDIvDGSVQKDvVxAVcW','owner','FALSE');
INSERT INTO users VALUES (4,'bob@rs.com','$2a$10$JPmC/zClzMp12T9iZPhpaO','$2a$10$JPmC/zClzMp12T9iZPhpaOa6HI1PUkbozuNea7fzDawfoKCcK9Id.','owner','FALSE');
INSERT INTO users VALUES (5,'will@pai.com','$2a$10$GAuxDpv5sg0UMm.C3ZkkOu','$2a$10$GAuxDpv5sg0UMm.C3ZkkOu0UK2RC2s3gMoEvblA.64OWJ5GzSuO4.','owner','FALSE');
INSERT INTO users VALUES (6,'christmas@expendables.com','$2a$10$NWBeaabiqKucxLJGpBNxmO','$2a$10$NWBeaabiqKucxLJGpBNxmOPzbGAGbYGP4/6P3hVaQPLY7mxh//gQS','customer','FALSE');
INSERT INTO users VALUES (7,'joesoto@td.com','$2a$10$No26sxZ7R2xyAvnNL2QNpe','$2a$10$No26sxZ7R2xyAvnNL2QNpeW1dbS.4y4AyYnoJ8fB7YOreatKnNYNS','customer','FALSE');
INSERT INTO users VALUES (8,'chirsrock@hollywood.com','$2a$10$OBjAKkwgU4GJgCrI1sut6u','$2a$10$OBjAKkwgU4GJgCrI1sut6uGk8vji3N/8S9vyfPovP/ls0CP5agyf2','customer','FALSE');
INSERT INTO users VALUES (9,'zuckerberg@fb.com','$2a$10$k3lEbGW65aZunIxSuolGLO','$2a$10$k3lEbGW65aZunIxSuolGLOs.hw.quc13EGMUIdni2uYxZy7FTvA6i','customer','FALSE');
INSERT INTO users VALUES (10,'thomas@bayern.de','$2a$10$Da19EZuesvRdXZqOvTX4dO','$2a$10$Da19EZuesvRdXZqOvTX4dOVe.m3IRNUTGcdC4MfWpdE4/cHOF9u8q','customer','FALSE');


INSERT INTO owners VALUES (1,'Monty','Singh','2017-02-16 18:54:58+00',4167822931,'',2);
INSERT INTO owners VALUES (2,'Bill','Xiu','2017-02-16 18:59:12+00',4127443512,'',3);
INSERT INTO owners VALUES (3,'Bob','Thames','2017-02-16 19:03:11+00',4124135221,'',4);
INSERT INTO owners VALUES (4,'Will','Homes','2017-02-16 19:07:12+00',4124153512,'',5);


INSERT INTO paymentPlans VALUES (1,'Lunch A Bunch','You get 10 Meals. $6/ meal.','',60.0);
INSERT INTO paymentPlans VALUES (2,'Lunch A Lot','You get 20 Meals. $6/ meal.','',120.0);


INSERT INTO restaurants VALUES (1,'Riddle Room','579 Yonge Street','Toronto','Ontario','Canada','M4Y1Z2',6473442637,'','FALSE','','',1);
INSERT INTO restaurants VALUES (2,'Kaiju','384 Yonge Street','Toronto','Ontario','Canada','M5B241',6477486338,'','FALSE','','',2);
INSERT INTO restaurants VALUES (3,'Richmond Station','1 Richmond Street W','Toronto','Ontario','Canada','M5H3W4',6477481444,'','FALSE','','',3);
INSERT INTO restaurants VALUES (4,'PAI','18 Duncan Street','Toronto','Ontario','Canada','M5H3G6',4169014724,'','FALSE','','',4);


INSERT INTO meals VALUES (1,'Chocolate Milkshake','Amazing','Amazingly Good','Chocolate, Milk, Sugar',5.0,'',1);
INSERT INTO meals VALUES (2,'Pizza Panini','Amazing','You gotta have this one','Veggies, Tomato, Chicken',8.0,'',1);
INSERT INTO meals VALUES (3,'Malaysian Fried Sambal Udon','Udon noodles stir-fried with homemade sambal sauce, onion, fish balls, and chicken','Creative fusion dishes!','Sambal sauce, Onions, Fish Balls, Chicken',9.0,'',2);
INSERT INTO meals VALUES (4,'Crispy Pepper Chicken','Stir-fried crispy chicken seasoned with freshly ground black pepper','Creative fusion dishes!','Veggies, Chicken, Black Pepper',9.0,'',2);
INSERT INTO meals VALUES (5,'Grilled Cornish Hen','Hen stirred in potato sauce.','You are kidding me!','rutabaga puree, potato pave, truffled celery, carrots, white wine jus, watercress',26.0,'',3);
INSERT INTO meals VALUES (6,'Station Burger','Burger that is in a station.','The final burger you will ever have!','lettuce, beet chutney, aged cheddar, milk bun, rosemary fries, dill pickle, garlic aioli',21.0,'',3);
INSERT INTO meals VALUES (7,'Khao Soi with braised beef','Fresh egg noodles in a golden curry topped with crispy noodles, coriander, green onions and braised beef (contains shrimp paste)','Braising Beef All Day','shrimp paste, beef, noodles, coriander, green onions',13.0,'',4);
INSERT INTO meals VALUES (8,'Fried Fish with Green Curry sauce and Rice','Crispy Basa Fillet with crispy shallots served with green curry sauce and rice. (contains oyster sauce)','I see Green Fish All Day!','fish, shallots, green curry sauce, rice, oyster sauce',13.0,'',4);


INSERT INTO customers VALUES (1,'Christmas','Carter',22,'female','2017-02-01','2017-02-28','2017-02-16 18:54:58+00',10,4167211829,'Toronto','Canada','','TRUE','FALSE',NULL,'',6,1);
INSERT INTO customers VALUES (2,'Joe','Soto',32,'male','2017-02-01','2017-02-28','2017-02-16 18:59:12+00',20,4167221824,'Toronto','Canada','','TRUE','FALSE',NULL,'',7,2);
INSERT INTO customers VALUES (3,'Chris','Rock',42,'male','2017-02-01','2017-02-28','2017-02-16 19:03:11+00',10,4167211212,'Toronto','Canada','','TRUE','FALSE',NULL,'',8,1);
INSERT INTO customers VALUES (4,'Mark','Zuckerberg',32,'male','2017-02-01','2017-02-28','2017-02-16 19:07:12+00',20,4167211888,'Toronto','Canada','','TRUE','FALSE',NULL,'',9,2);
INSERT INTO customers VALUES (5,'Thomas','Muller',31,'male','2017-02-01','2017-02-28','2017-02-16 18:54:58+01',20,4167211329,'Toronto','Canada','','TRUE','FALSE',NULL,'',10,2);


INSERT INTO invoices VALUES (1,'2017-02-01','paid',8.0,60.0,'',1);
INSERT INTO invoices VALUES (2,'2017-02-01','paid',15.0,120.0,'',2);
INSERT INTO invoices VALUES (3,'2017-02-01','paid',8.0,60.0,'',3);
INSERT INTO invoices VALUES (4,'2017-02-01','paid',15.0,120.0,'',4);
INSERT INTO invoices VALUES (5,'2017-02-01','paid',15.0,120.0,'',5);

INSERT INTO pickUpTimes VALUES (1,'11:30 AM to 11:45 AM');
INSERT INTO pickUpTimes VALUES (2,'11:45 AM to 12:00 PM');
INSERT INTO pickUpTimes VALUES (3,'12:00 PM to 12:15 PM');
INSERT INTO pickUpTimes VALUES (4,'12:15 PM to 12:30 PM');
INSERT INTO pickUpTimes VALUES (5,'12:30 PM to 12:45 PM');
INSERT INTO pickUpTimes VALUES (6,'12:45 PM to 13:00 PM');
INSERT INTO pickUpTimes VALUES (7,'13:00 PM to 13:15 PM');
INSERT INTO pickUpTimes VALUES (8,'13:15 PM to 13:30 PM');

INSERT INTO offers VALUES (1,'2017-02-16 05:00:00+00',40,40,4);
INSERT INTO offers VALUES (2,'2017-02-17 05:00:00+00',30,30,2);
INSERT INTO offers VALUES (3,'2017-02-17 05:00:00+00',30,30,3);
INSERT INTO offers VALUES (4,'2017-02-21 05:00:00+00',35,35,4);

INSERT INTO orders VALUES (1,'2017-02-17','FALSE','FALSE',3,2,1);
INSERT INTO orders VALUES (2,'2017-02-17','FALSE','FALSE',2,3,2);
INSERT INTO orders VALUES (3,'2017-02-17','FALSE','FALSE',5,2,3);
INSERT INTO orders VALUES (4,'2017-02-17','FALSE','FALSE',5,3,4);
INSERT INTO orders VALUES (5,'2017-02-17','FALSE','FALSE',6,3,4);

INSERT INTO feedbacks VALUES (1,'Meal was very  good!',5,5,5,1);
INSERT INTO feedbacks VALUES (2,'Terrible Meal. Salad was dry and stale.',2,3,2,2);
INSERT INTO feedbacks VALUES (3,'Portion size was good. Yummy!',5,5,5,3);
INSERT INTO feedbacks VALUES (4,'',5,4,4,4);
INSERT INTO feedbacks VALUES (5,'Loved It!',5,5,5,5);

SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));
SELECT setval('owners_id_seq', (SELECT MAX(id) from "owners"));
SELECT setval('paymentPlans_id_seq', (SELECT MAX(id) from "paymentPlans"));
SELECT setval('restaurants_id_seq', (SELECT MAX(id) from "restaurants"));
SELECT setval('meals_id_seq', (SELECT MAX(id) from "meals"));
SELECT setval('customers_id_seq', (SELECT MAX(id) from "customers"));
SELECT setval('invoices_id_seq', (SELECT MAX(id) from "invoices"));
SELECT setval('pickUpTimes_id_seq', (SELECT MAX(id) from "pickUpTimes"));
SELECT setval('offers_id_seq', (SELECT MAX(id) from "offers"));
SELECT setval('orders_id_seq', (SELECT MAX(id) from "orders"));
SELECT setval('feedbacks_id_seq', (SELECT MAX(id) from "feedbacks"));
COMMIT;
