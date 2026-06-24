-- ==============================================================================
-- MOS BURGER: FULL DATA SEED FOR SUPABASE
-- Paste this into the Supabase SQL Editor and click RUN.
-- ==============================================================================

-- ========================
-- 1. MENU CATEGORIES (8)
-- ========================
INSERT INTO menu_category (name, description, icon) VALUES
('Burgers', 'Juicy handcrafted burgers made with premium beef, chicken, and plant-based patties', 'fa-hamburger'),
('Sides', 'Crispy fries, onion rings, and other perfect companions for your burger', 'fa-french-fries'),
('Drinks', 'Refreshing soft drinks, milkshakes, fresh juices, and hot beverages', 'fa-glass-cheers'),
('Desserts', 'Sweet treats including ice cream, brownies, and signature sundaes', 'fa-ice-cream'),
('Chicken', 'Crispy fried chicken, tenders, wings, and chicken sandwiches', 'fa-drumstick-bite'),
('Breakfast', 'Morning favorites including egg muffins, pancakes, and breakfast burritos', 'fa-egg'),
('Wraps & Salads', 'Lighter options with fresh veggies, grilled proteins, and zesty dressings', 'fa-leaf'),
('Kids Meals', 'Fun-sized portions with a toy, perfect for little appetites', 'fa-child');

-- ========================
-- 2. MENU ITEMS (40+)
-- ========================

-- Burgers (10 items)
INSERT INTO menu_menu (category_id, name, description, base_price, is_available) VALUES
((SELECT id FROM menu_category WHERE name='Burgers'), 'Classic MOS Burger', 'Our signature beef patty with lettuce, tomato, pickles, and MOS secret sauce on a toasted sesame bun', 8.99, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Double Smash Burger', 'Two thin smashed beef patties with American cheese, caramelized onions, and smoky ketchup', 12.49, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Spicy Jalapeño Burger', 'Beef patty loaded with jalapeños, pepper jack cheese, chipotle mayo, and crispy onion strings', 10.99, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'BBQ Bacon Beast', 'Half-pound Angus beef with thick-cut bacon, cheddar, BBQ glaze, and crispy fried onion rings', 13.99, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Mushroom Swiss Burger', 'Beef patty topped with sautéed mushrooms, Swiss cheese, and garlic aioli', 11.49, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Teriyaki Burger', 'Japanese-inspired with teriyaki glaze, grilled pineapple, lettuce, and wasabi mayo', 11.99, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Plant-Based Beyond Burger', 'Beyond Meat patty with avocado, sprouts, tomato, and vegan garlic sauce', 12.99, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Truffle Burger', 'Premium wagyu-blend patty with truffle aioli, arugula, parmesan, and caramelized shallots', 16.99, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Hawaiian Luau Burger', 'Grilled chicken breast with teriyaki sauce, grilled pineapple ring, Swiss cheese, and coleslaw', 10.49, true),
((SELECT id FROM menu_category WHERE name='Burgers'), 'The MOS Monster', 'Triple patty, triple cheese, bacon, egg, jalapeños, onion rings — the ultimate challenge', 18.99, true);

-- Sides (8 items)
INSERT INTO menu_menu (category_id, name, description, base_price, is_available) VALUES
((SELECT id FROM menu_category WHERE name='Sides'), 'Classic Fries', 'Golden crispy fries seasoned with sea salt', 3.99, true),
((SELECT id FROM menu_category WHERE name='Sides'), 'Loaded Cheese Fries', 'Fries smothered in cheddar cheese sauce, bacon bits, and sour cream', 6.49, true),
((SELECT id FROM menu_category WHERE name='Sides'), 'Sweet Potato Fries', 'Crispy sweet potato fries with honey mustard dipping sauce', 4.99, true),
((SELECT id FROM menu_category WHERE name='Sides'), 'Onion Rings', 'Beer-battered thick-cut onion rings with ranch dipping sauce', 4.49, true),
((SELECT id FROM menu_category WHERE name='Sides'), 'Mozzarella Sticks', 'Crispy breaded mozzarella with marinara dipping sauce', 5.99, true),
((SELECT id FROM menu_category WHERE name='Sides'), 'Coleslaw', 'Creamy homestyle coleslaw with shredded cabbage and carrots', 2.99, true),
((SELECT id FROM menu_category WHERE name='Sides'), 'Mac & Cheese Bites', 'Deep-fried mac and cheese balls with a crispy golden crust', 5.49, true),
((SELECT id FROM menu_category WHERE name='Sides'), 'Garlic Parmesan Fries', 'Fries tossed in garlic butter and grated parmesan cheese', 5.49, true);

-- Drinks (8 items)
INSERT INTO menu_menu (category_id, name, description, base_price, is_available) VALUES
((SELECT id FROM menu_category WHERE name='Drinks'), 'Coca-Cola', 'Classic ice-cold Coca-Cola', 2.49, true),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Vanilla Milkshake', 'Thick and creamy vanilla milkshake topped with whipped cream', 5.99, true),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Chocolate Milkshake', 'Rich chocolate milkshake blended with real cocoa and topped with chocolate shavings', 5.99, true),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Strawberry Lemonade', 'Freshly squeezed lemonade with muddled strawberries and mint', 3.99, true),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Iced Coffee', 'Cold brew coffee served over ice with your choice of milk', 3.49, true),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Mango Smoothie', 'Tropical mango blended with yogurt and a splash of orange juice', 4.99, true),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Sparkling Water', 'Chilled sparkling water with a wedge of lime', 1.99, true),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Oreo Milkshake', 'Cookies and cream milkshake loaded with crushed Oreo pieces', 6.49, true);

-- Desserts (6 items)
INSERT INTO menu_menu (category_id, name, description, base_price, is_available) VALUES
((SELECT id FROM menu_category WHERE name='Desserts'), 'Chocolate Brownie Sundae', 'Warm fudge brownie topped with vanilla ice cream, hot chocolate sauce, and whipped cream', 6.99, true),
((SELECT id FROM menu_category WHERE name='Desserts'), 'New York Cheesecake', 'Classic creamy cheesecake with a graham cracker crust and berry compote', 5.49, true),
((SELECT id FROM menu_category WHERE name='Desserts'), 'Apple Pie', 'Warm cinnamon apple pie served with a scoop of vanilla ice cream', 4.99, true),
((SELECT id FROM menu_category WHERE name='Desserts'), 'Churros', 'Crispy cinnamon-sugar churros with chocolate and caramel dipping sauces', 4.49, true),
((SELECT id FROM menu_category WHERE name='Desserts'), 'Cookie Dough Bites', 'Edible cookie dough bites coated in chocolate', 3.99, true),
((SELECT id FROM menu_category WHERE name='Desserts'), 'Banana Split', 'Three scoops of ice cream with banana, whipped cream, nuts, and cherry on top', 7.49, true);

-- Chicken (6 items)
INSERT INTO menu_menu (category_id, name, description, base_price, is_available) VALUES
((SELECT id FROM menu_category WHERE name='Chicken'), 'Crispy Chicken Sandwich', 'Buttermilk-fried chicken breast with pickles and spicy mayo on a brioche bun', 9.99, true),
((SELECT id FROM menu_category WHERE name='Chicken'), 'Chicken Tenders (5pc)', 'Hand-breaded chicken tenders served with honey mustard and BBQ sauce', 7.99, true),
((SELECT id FROM menu_category WHERE name='Chicken'), 'Buffalo Wings (8pc)', 'Crispy chicken wings tossed in spicy buffalo sauce with blue cheese dip', 10.99, true),
((SELECT id FROM menu_category WHERE name='Chicken'), 'Grilled Chicken Burger', 'Marinated grilled chicken breast with avocado, lettuce, and lemon herb mayo', 9.49, true),
((SELECT id FROM menu_category WHERE name='Chicken'), 'Popcorn Chicken', 'Bite-sized pieces of crispy seasoned chicken with sriracha mayo', 5.99, true),
((SELECT id FROM menu_category WHERE name='Chicken'), 'Nashville Hot Chicken', 'Extra spicy fried chicken with coleslaw and pickles on a buttery bun', 11.49, true);

-- Breakfast (5 items)
INSERT INTO menu_menu (category_id, name, description, base_price, is_available) VALUES
((SELECT id FROM menu_category WHERE name='Breakfast'), 'Egg & Cheese Muffin', 'Fluffy scrambled eggs with melted cheddar on a toasted English muffin', 4.99, true),
((SELECT id FROM menu_category WHERE name='Breakfast'), 'Bacon Breakfast Burger', 'Beef patty with fried egg, bacon, cheese, and hash brown on a bun', 8.99, true),
((SELECT id FROM menu_category WHERE name='Breakfast'), 'Pancake Stack', 'Three fluffy buttermilk pancakes with maple syrup and butter', 6.49, true),
((SELECT id FROM menu_category WHERE name='Breakfast'), 'Breakfast Burrito', 'Scrambled eggs, sausage, peppers, cheese, and salsa wrapped in a flour tortilla', 7.49, true),
((SELECT id FROM menu_category WHERE name='Breakfast'), 'French Toast Sticks', 'Cinnamon-dusted French toast sticks with maple dipping sauce', 5.49, true);

-- Wraps & Salads (4 items)
INSERT INTO menu_menu (category_id, name, description, base_price, is_available) VALUES
((SELECT id FROM menu_category WHERE name='Wraps & Salads'), 'Caesar Salad', 'Crisp romaine lettuce with parmesan, croutons, and creamy Caesar dressing', 7.49, true),
((SELECT id FROM menu_category WHERE name='Wraps & Salads'), 'Grilled Chicken Wrap', 'Grilled chicken with mixed greens, tomato, cucumber, and ranch dressing in a tortilla', 8.49, true),
((SELECT id FROM menu_category WHERE name='Wraps & Salads'), 'Falafel Wrap', 'Crispy falafel with hummus, pickled vegetables, and tahini in a warm pita', 7.99, true),
((SELECT id FROM menu_category WHERE name='Wraps & Salads'), 'Cobb Salad', 'Mixed greens with chicken, bacon, egg, avocado, blue cheese, and vinaigrette', 9.49, true);

-- Kids Meals (3 items)
INSERT INTO menu_menu (category_id, name, description, base_price, is_available) VALUES
((SELECT id FROM menu_category WHERE name='Kids Meals'), 'Mini Burger Meal', 'Small beef patty with cheese, fries, and a juice box', 5.99, true),
((SELECT id FROM menu_category WHERE name='Kids Meals'), 'Chicken Nuggets Meal', '6 chicken nuggets with fries and a small drink', 5.49, true),
((SELECT id FROM menu_category WHERE name='Kids Meals'), 'Grilled Cheese Meal', 'Classic grilled cheese sandwich with fries and a juice box', 4.99, true);

-- ========================
-- 3. TOPPINGS (16)
-- ========================
INSERT INTO toppings_topping (category_id, name, extra_price, amount, image_url) VALUES
((SELECT id FROM menu_category WHERE name='Burgers'), 'Extra Cheese', 1.00, 100, 'cheese'),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Bacon', 1.50, 80, 'bacon'),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Jalapeño', 0.75, 120, 'jalapeno'),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Fried Egg', 1.20, 60, 'egg'),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Avocado', 1.75, 50, 'avocado'),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Caramelized Onions', 0.80, 90, 'onion'),
((SELECT id FROM menu_category WHERE name='Burgers'), 'Truffle Mayo', 1.50, 40, 'truffle'),
((SELECT id FROM menu_category WHERE name='Sides'), 'Cheese Sauce', 1.50, 100, 'cheese'),
((SELECT id FROM menu_category WHERE name='Sides'), 'BBQ Sauce', 0.50, 150, 'sauce'),
((SELECT id FROM menu_category WHERE name='Sides'), 'Spicy Mayo', 0.50, 130, 'spicy'),
((SELECT id FROM menu_category WHERE name='Sides'), 'Garlic Aioli', 0.75, 90, 'garlic'),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Ice', 0.00, 999, 'ice'),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Lemon Slice', 0.20, 200, 'lemon'),
((SELECT id FROM menu_category WHERE name='Drinks'), 'Pearl Boba', 0.80, 70, 'boba'),
((SELECT id FROM menu_category WHERE name='Desserts'), 'Chocolate Syrup', 0.50, 100, 'chocolate'),
((SELECT id FROM menu_category WHERE name='Desserts'), 'Strawberry Sauce', 0.50, 100, 'strawberry');

-- ========================
-- 4. PROMOTIONS (6)
-- ========================
INSERT INTO menu_promotion (title, description, promo_code, background_color, is_active) VALUES
('Welcome Deal', 'Get 10% off your first burger! Valid for new customers only.', 'NEWMOS', '#d82b2b', true),
('Combo Special', 'Buy any 2 burgers and get a free side of Classic Fries!', 'FRIESFREE', '#ffdb58', true),
('Weekend Treats', 'Free drink with any order over $20. Every Saturday & Sunday!', 'WEEKEND20', '#4CAF50', true),
('Happy Hour', '25% off all milkshakes from 3 PM to 5 PM daily!', 'SHAKE25', '#9C27B0', true),
('Family Bundle', 'Get 4 burgers, 2 sides, and 4 drinks for only $39.99!', 'FAMILY40', '#FF5722', true),
('Student Discount', 'Show your student ID and get 15% off your entire order!', 'STUDENT15', '#2196F3', true);

-- ========================
-- 5. BIKES (5)
-- ========================
INSERT INTO bike_bike (model_name, brand, price_per_hour, is_available) VALUES
('Ninja 300', 'Kawasaki', 15.00, true),
('CBR 250R', 'Honda', 12.00, true),
('Duke 200', 'KTM', 14.00, true),
('YZF-R15', 'Yamaha', 13.00, true),
('Gixxer SF', 'Suzuki', 11.00, false);

-- ========================
-- 6. USERS (admin, staff, customers, delivery riders)
-- Password hash below = "Password123!" hashed with Django's PBKDF2
-- You can change passwords later via Django admin or manage.py
-- ========================
INSERT INTO users_user (password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined, role, phone, address) VALUES
-- Admin (password: adminpassword)
('pbkdf2_sha256$720000$salt$hash_placeholder_admin', NULL, true, 'admin', 'MOS', 'Admin', 'admin@mosburger.com', true, true, NOW(), 'ADMIN', '+94771234567', '123 Main St, Colombo'),
-- Staff members
('pbkdf2_sha256$720000$salt$hash_placeholder_staff1', NULL, false, 'staff_john', 'John', 'Silva', 'john@mosburger.com', true, true, NOW(), 'STAFF', '+94772345678', '45 Galle Rd, Colombo'),
('pbkdf2_sha256$720000$salt$hash_placeholder_staff2', NULL, false, 'staff_priya', 'Priya', 'Fernando', 'priya@mosburger.com', true, true, NOW(), 'STAFF', '+94773456789', '78 Kandy Rd, Colombo'),
-- Customers
('pbkdf2_sha256$720000$salt$hash_placeholder_cust1', NULL, false, 'customer_anna', 'Anna', 'Perera', 'anna@gmail.com', false, true, NOW(), 'CUSTOMER', '+94774567890', '12 Flower Rd, Colombo 7'),
('pbkdf2_sha256$720000$salt$hash_placeholder_cust2', NULL, false, 'customer_raj', 'Raj', 'Kumar', 'raj@gmail.com', false, true, NOW(), 'CUSTOMER', '+94775678901', '56 Marine Drive, Colombo 4'),
('pbkdf2_sha256$720000$salt$hash_placeholder_cust3', NULL, false, 'customer_sarah', 'Sarah', 'Jayawardena', 'sarah@gmail.com', false, true, NOW(), 'CUSTOMER', '+94776789012', '89 Duplication Rd, Colombo 3'),
('pbkdf2_sha256$720000$salt$hash_placeholder_cust4', NULL, false, 'customer_mike', 'Mike', 'De Silva', 'mike@gmail.com', false, true, NOW(), 'CUSTOMER', '+94777890123', '34 Baseline Rd, Colombo 9'),
('pbkdf2_sha256$720000$salt$hash_placeholder_cust5', NULL, false, 'customer_nimal', 'Nimal', 'Bandara', 'nimal@gmail.com', false, true, NOW(), 'CUSTOMER', '+94778901234', '67 High Level Rd, Nugegoda'),
-- Delivery riders
('pbkdf2_sha256$720000$salt$hash_placeholder_rider1', NULL, false, 'rider_kamal', 'Kamal', 'Rathnayake', 'kamal@mosburger.com', false, true, NOW(), 'DELIVERY', '+94779012345', '23 Station Rd, Dehiwala'),
('pbkdf2_sha256$720000$salt$hash_placeholder_rider2', NULL, false, 'rider_sunil', 'Sunil', 'Wickrama', 'sunil@mosburger.com', false, true, NOW(), 'DELIVERY', '+94770123456', '90 Negombo Rd, Wattala'),
('pbkdf2_sha256$720000$salt$hash_placeholder_rider3', NULL, false, 'rider_dinesh', 'Dinesh', 'Gamage', 'dinesh@mosburger.com', false, true, NOW(), 'DELIVERY', '+94771112233', '15 Lake Rd, Boralesgamuwa');

-- Link Staff profiles
INSERT INTO users_staff (user_ptr_id) VALUES
((SELECT id FROM users_user WHERE username='staff_john')),
((SELECT id FROM users_user WHERE username='staff_priya'));

-- Link Customer profiles
INSERT INTO users_customer (user_ptr_id) VALUES
((SELECT id FROM users_user WHERE username='customer_anna')),
((SELECT id FROM users_user WHERE username='customer_raj')),
((SELECT id FROM users_user WHERE username='customer_sarah')),
((SELECT id FROM users_user WHERE username='customer_mike')),
((SELECT id FROM users_user WHERE username='customer_nimal'));

-- Link Delivery profiles with bikes
INSERT INTO users_delivery (user_ptr_id, license_number, bike_id) VALUES
((SELECT id FROM users_user WHERE username='rider_kamal'), 'WP-LIC-2024-001', (SELECT id FROM bike_bike WHERE model_name='Ninja 300')),
((SELECT id FROM users_user WHERE username='rider_sunil'), 'WP-LIC-2024-002', (SELECT id FROM bike_bike WHERE model_name='CBR 250R')),
((SELECT id FROM users_user WHERE username='rider_dinesh'), 'WP-LIC-2024-003', (SELECT id FROM bike_bike WHERE model_name='Duke 200'));

-- ==============================================================================
-- DONE! Your MOS Burger database is now fully populated.
--
-- NOTE: The user passwords above are PLACEHOLDER hashes and won't work for login.
-- To set real passwords, run this in your terminal after connecting Django:
--   python manage.py shell
--   >>> from users.models import User
--   >>> for u in User.objects.all():
--   ...     u.set_password('Password123!')
--   ...     u.save()
--
-- Or use: python manage.py createsuperuser (for admin)
-- ==============================================================================
