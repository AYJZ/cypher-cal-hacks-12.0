
-- Delete 2 scenarios to keep only 3 for ordering category
DELETE FROM scenarios WHERE id IN ('8d97b513-de62-4770-abb3-2bce2d43f221', '361cf6d0-470c-460f-8b9d-a9f69bf88fa9');

-- Update the 3 remaining scenarios with contextual information
UPDATE scenarios 
SET context = 'You are at a popular bubble tea shop in Taiwan. The menu has various tea bases, toppings, and ice/sugar level options. Help the customer order in Chinese.'
WHERE id = '10bd7932-e259-4bea-80d1-ec5e34cb34ce';

UPDATE scenarios 
SET context = 'You are at a local Chinese restaurant. There is a menu with various dishes, and the customer wants to order food. Help them navigate the menu and place an order in Chinese.'
WHERE id = '30e61dcd-83f8-43f7-afda-7b0eae75ad07';

UPDATE scenarios 
SET context = 'You are at a Chinese grocery store or market. The customer wants to buy fresh produce, snacks, or ingredients. Help them ask about items and make purchases in Chinese.'
WHERE id = 'a20f54ac-f190-4bac-9f57-e0dd0672b18d';
