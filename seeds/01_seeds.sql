INSERT INTO users (name, email, password)
VALUES ('Lloyd Christmas', 'mocking_yeah_bird_yeah@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Harry Dunne', 'whos_got_the_foot_long@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Mary Swanson', 'so_youre_saying_theres_a_chance@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, province, city, country, street, post_code, active)
VALUES (3, 'The Ritz Aspen', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 1200, 5, 6, 8, 'Colorado', 'Aspen', 'USA', 'Who even knows', '85730', true),
(3, 'The Fairmont: Waterfront', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 700, 2, 1, 2, 'BC', 'Vancouver', 'Canada', 'Who even knows', 'V7M3M5', true),
(3, 'The Fairmont: Whistler', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 950, 2, 1, 2, 'BC', 'Whistler', 'Canada', 'Who even knows', 'V7M3M5', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2022-09-30', '2022-10-15', 1, 3),
('2021-06-01', '2021-06-15', 2, 3),
('2022-10-30', '2022-11-29', 2, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 7, 5, 'messeges'),
(1, 2, 8, 5, 'messeges'),
(1, 2, 9, 5, 'messeges');