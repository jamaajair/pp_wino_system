-- ========================================
-- SCRIPT D'INSERTION DE DONNÉES DE TEST
-- Thème : MB Food - Alimentation Générale
-- ========================================

-- Nettoyage des tables (ordre inverse des dépendances)
DELETE FROM financial_transactions;
DELETE FROM financial_accounts;
DELETE FROM purchase_document_lines;
DELETE FROM purchase_documents;
DELETE FROM sale_document_lines;
DELETE FROM sale_documents;
DELETE FROM payments;
DELETE FROM customer_price_agreements;
DELETE FROM stock_movements;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM suppliers;
DELETE FROM customers;
DELETE FROM users;

-- Réinitialiser les séquences
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE suppliers AUTO_INCREMENT = 1;
ALTER TABLE payments AUTO_INCREMENT = 1;
ALTER TABLE stock_movements AUTO_INCREMENT = 1;
ALTER TABLE customer_price_agreements AUTO_INCREMENT = 1;
ALTER TABLE sale_documents AUTO_INCREMENT = 1;
ALTER TABLE sale_document_lines AUTO_INCREMENT = 1;
ALTER TABLE purchase_documents AUTO_INCREMENT = 1;
ALTER TABLE purchase_document_lines AUTO_INCREMENT = 1;
ALTER TABLE financial_accounts AUTO_INCREMENT = 1;
ALTER TABLE financial_transactions AUTO_INCREMENT = 1;

-- ========================================
-- UTILISATEURS
-- ========================================
INSERT INTO users (username, password, email, first_name, last_name, phone, role, active, created_at, updated_at) VALUES
('admin', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'admin@mbfood.be', 'Mohammed', 'Benali', '+32470123456', 'ADMIN', true, NOW(), NOW()),
('manager', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'manager@mbfood.be', 'Fatima', 'El Amrani', '+32471234567', 'MANAGER', true, NOW(), NOW()),
('vendeur1', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'vendeur@mbfood.be', 'Hassan', 'Bouazza', '+32472345678', 'SALES', true, NOW(), NOW()),
('magasinier', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'stock@mbfood.be', 'Karim', 'Ziani', '+32473456789', 'WAREHOUSE', true, NOW(), NOW());

-- ========================================
-- CATÉGORIES DE PRODUITS
-- ========================================
INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Épicerie Salée', 'Conserves, pâtes, riz, huiles et condiments', NOW(), NOW()),
('Épicerie Sucrée', 'Biscuits, chocolats, confiseries et pâtisseries', NOW(), NOW()),
('Boissons', 'Sodas, jus, eaux et boissons chaudes', NOW(), NOW()),
('Produits Frais', 'Fruits, légumes et produits laitiers', NOW(), NOW()),
('Hygiène & Entretien', 'Produits de nettoyage et d''hygiène personnelle', NOW(), NOW()),
('Snacks & Apéritifs', 'Chips, cacahuètes et grignotages', NOW(), NOW()),
('Pâtisserie Orientale', 'Baklava, makrout et délices orientaux', NOW(), NOW()),
('Produits du Monde', 'Spécialités africaines, orientales et exotiques', NOW(), NOW());

-- ========================================
-- PRODUITS (Alimentation Générale)
-- ========================================

-- Épicerie Salée
INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
('Couscous Ferrero 1kg', 'Couscous grain moyen qualité supérieure', 2.99, 150, 'couscous-ferrero.jpg', 1, NOW(), NOW()),
('Harissa Cap Bon 210g', 'Pâte de piment rouge traditionnelle tunisienne', 1.89, 200, 'harissa-capbon.jpg', 1, NOW(), NOW()),
('Huile d''Olive Extra Vierge 1L', 'Huile d''olive première pression à froid', 7.95, 80, 'huile-olive.jpg', 1, NOW(), NOW()),
('Pâtes Barilla Spaghetti 500g', 'Pâtes italiennes blé dur', 1.29, 300, 'barilla-spaghetti.jpg', 1, NOW(), NOW()),
('Riz Basmati Uncle Ben''s 1kg', 'Riz long grain parfumé', 3.49, 120, 'riz-basmati.jpg', 1, NOW(), NOW()),
('Thon à l''Huile Mabrouka 160g', 'Thon entier à l''huile d''olive', 2.15, 180, 'thon-mabrouka.jpg', 1, NOW(), NOW()),
('Sardines à l''Huile 125g', 'Sardines portugaises de qualité', 1.65, 220, 'sardines.jpg', 1, NOW(), NOW()),
('Concentré de Tomate Le Cabanon 210g', 'Double concentré de tomate', 0.99, 250, 'concentre-tomate.jpg', 1, NOW(), NOW()),
('Pois Chiches Goya 400g', 'Pois chiches en conserve', 1.19, 160, 'pois-chiches.jpg', 1, NOW(), NOW()),
('Miel d''Acacia 500g', 'Miel pur et naturel', 8.50, 60, 'miel-acacia.jpg', 1, NOW(), NOW());

-- Épicerie Sucrée
INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
('Nutella 750g', 'Pâte à tartiner aux noisettes et cacao', 5.95, 100, 'nutella.jpg', 2, NOW(), NOW()),
('Biscuits Prince Chocolat', 'Biscuits fourrés au chocolat', 2.49, 180, 'prince.jpg', 2, NOW(), NOW()),
('Confiture Bonne Maman Fraise 370g', 'Confiture de fraises', 3.29, 90, 'bonne-maman.jpg', 2, NOW(), NOW()),
('Chocolat Milka Noisettes 100g', 'Chocolat au lait et noisettes entières', 1.79, 200, 'milka.jpg', 2, NOW(), NOW()),
('Dattes Deglet Nour 500g', 'Dattes naturelles d''Algérie', 4.50, 70, 'dattes.jpg', 2, NOW(), NOW()),
('Halva Pistache 400g', 'Confiserie orientale au sésame et pistaches', 5.99, 50, 'halva.jpg', 2, NOW(), NOW());

-- Boissons
INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
('Coca-Cola 1.5L', 'Boisson gazeuse', 1.89, 250, 'coca-cola.jpg', 3, NOW(), NOW()),
('Fanta Orange 1.5L', 'Boisson gazeuse saveur orange', 1.75, 230, 'fanta.jpg', 3, NOW(), NOW()),
('Eau Spa Reine 6x1.5L', 'Eau minérale plate pack de 6', 3.99, 100, 'spa.jpg', 3, NOW(), NOW()),
('Jus d''Orange Tropicana 1L', 'Pur jus d''orange sans sucres ajoutés', 2.95, 140, 'tropicana.jpg', 3, NOW(), NOW()),
('Thé Vert à la Menthe 25 sachets', 'Infusion orientale menthe et thé vert', 2.49, 120, 'the-menthe.jpg', 3, NOW(), NOW()),
('Café Carte Noire Moulu 250g', 'Café arabica moulu', 4.25, 80, 'carte-noire.jpg', 3, NOW(), NOW());

-- Produits Frais
INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
('Lait Demi-Écrémé Inex 1L', 'Lait frais belge', 1.15, 180, 'lait-inex.jpg', 4, NOW(), NOW()),
('Yaourt Nature Danone x8', 'Yaourt nature crémeux', 2.79, 150, 'danone.jpg', 4, NOW(), NOW()),
('Beurre Doux Président 250g', 'Beurre de baratte AOP', 2.99, 100, 'beurre-president.jpg', 4, NOW(), NOW()),
('Fromage Gouda Tranché 200g', 'Fromage hollandais tranches', 2.49, 90, 'gouda.jpg', 4, NOW(), NOW()),
('Œufs Frais x12', 'Œufs de poules élevées en plein air', 3.49, 120, 'oeufs.jpg', 4, NOW(), NOW());

-- Snacks & Apéritifs
INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
('Chips Lay''s Paprika 200g', 'Chips saveur paprika', 2.29, 200, 'lays-paprika.jpg', 6, NOW(), NOW()),
('Cacahuètes Grillées Salées 500g', 'Cacahuètes apéritif', 2.99, 150, 'cacahuetes.jpg', 6, NOW(), NOW()),
('Olives Vertes Dénoyautées 370g', 'Olives vertes en saumure', 2.49, 110, 'olives.jpg', 6, NOW(), NOW()),
('Pistaches Grillées 200g', 'Pistaches naturelles salées', 5.95, 80, 'pistaches.jpg', 6, NOW(), NOW());

-- Pâtisserie Orientale
INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
('Baklava aux Amandes 500g', 'Pâtisserie feuilletée au miel et amandes', 9.99, 40, 'baklava.jpg', 7, NOW(), NOW()),
('Makrout aux Dattes 400g', 'Gâteau semoule fourré aux dattes', 6.50, 50, 'makrout.jpg', 7, NOW(), NOW()),
('Cornes de Gazelle 300g', 'Pâtisserie marocaine aux amandes', 7.95, 35, 'cornes-gazelle.jpg', 7, NOW(), NOW()),
('Zlabiya au Miel 500g', 'Beignets orientaux au miel', 5.99, 45, 'zlabiya.jpg', 7, NOW(), NOW());

-- Hygiène & Entretien
INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
('Lessive Ariel Liquide 2L', 'Lessive liquide 40 lavages', 8.95, 70, 'ariel.jpg', 5, NOW(), NOW()),
('Papier Toilette Lotus x12', 'Papier toilette triple épaisseur', 5.49, 100, 'lotus.jpg', 5, NOW(), NOW()),
('Liquide Vaisselle Fairy 500ml', 'Liquide vaisselle citron', 2.99, 120, 'fairy.jpg', 5, NOW(), NOW()),
('Savon de Marseille 400g', 'Savon traditionnel multi-usages', 3.95, 80, 'savon-marseille.jpg', 5, NOW(), NOW());

-- Produits du Monde
INSERT INTO products (name, description, price, stock, image_url, category_id, created_at, updated_at) VALUES
('Sauce Piquante Sriracha 430g', 'Sauce pimentée asiatique', 3.49, 90, 'sriracha.jpg', 8, NOW(), NOW()),
('Lait de Coco 400ml', 'Lait de coco cuisine asiatique', 1.99, 130, 'lait-coco.jpg', 8, NOW(), NOW()),
('Vermicelles de Riz 400g', 'Nouilles asiatiques', 2.29, 110, 'vermicelles.jpg', 8, NOW(), NOW()),
('Pâte de Curry Vert 50g', 'Pâte thaïlandaise épicée', 2.79, 70, 'curry-vert.jpg', 8, NOW(), NOW());

-- ========================================
-- CLIENTS
-- ========================================
INSERT INTO customers (code, name, email, phone, address, city, postal_code, country, tax_id, customer_type, credit_limit, balance, active, created_at, updated_at) VALUES
('CLI001', 'Restaurant Le Méditerranée', 'contact@mediterranee.be', '+32478901234', 'Rue de la Paix 45', 'Liège', '4000', 'Belgique', 'BE0123456789', 'COMPANY', 5000.00, 0.00, true, NOW(), NOW()),
('CLI002', 'Épicerie du Quartier', 'epicerie.quartier@gmail.com', '+32479012345', 'Avenue Louise 128', 'Bruxelles', '1050', 'Belgique', 'BE0234567890', 'COMPANY', 3000.00, 0.00, true, NOW(), NOW()),
('CLI003', 'Madame Amina Boutari', 'amina.boutari@outlook.com', '+32470234567', 'Rue des Guillemins 67', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, NOW(), NOW()),
('CLI004', 'Monsieur Youssef Mansouri', 'y.mansouri@hotmail.com', '+32471345678', 'Chaussée de Charleroi 234', 'Charleroi', '6000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, NOW(), NOW()),
('CLI005', 'Snack Istanbul', 'snack.istanbul@gmail.com', '+32472456789', 'Boulevard d''Avroy 12', 'Liège', '4000', 'Belgique', 'BE0345678901', 'COMPANY', 2000.00, 0.00, true, NOW(), NOW());

-- ========================================
-- FOURNISSEURS
-- ========================================
INSERT INTO suppliers (code, name, email, phone, address, city, postal_code, country, tax_id, contact_person, payment_terms, active, created_at, updated_at) VALUES
('FRS001', 'Metro Cash & Carry', 'commandes@metro.be', '+3224561234', 'Avenue du Port 45', 'Bruxelles', '1000', 'Belgique', 'BE0456789012', 'Marc Dubois', 30, true, NOW(), NOW()),
('FRS002', 'Importation Orientale SARL', 'import@oriental.be', '+3243217890', 'Rue de la Station 78', 'Liège', '4020', 'Belgique', 'BE0567890123', 'Ahmed Benali', 45, true, NOW(), NOW()),
('FRS003', 'Grossiste Alimentaire du Sud', 'contact@gasud.be', '+3265432109', 'Zone Industrielle 15', 'Charleroi', '6010', 'Belgique', 'BE0678901234', 'Sophie Laurent', 30, true, NOW(), NOW()),
('FRS004', 'Délices d''Orient Import', 'delices@dorient.com', '+3242109876', 'Rue des Fabriques 22', 'Verviers', '4800', 'Belgique', 'BE0789012345', 'Rachid El Fassi', 60, true, NOW(), NOW());

-- ========================================
-- MOUVEMENTS DE STOCK (Stock initial)
-- ========================================
INSERT INTO stock_movements (product_id, type, quantity, reason, reference_document, created_at) VALUES
-- Épicerie Salée
(1, 'IN', 150, 'Stock initial', 'INIT-001', NOW()),
(2, 'IN', 200, 'Stock initial', 'INIT-001', NOW()),
(3, 'IN', 80, 'Stock initial', 'INIT-001', NOW()),
(4, 'IN', 300, 'Stock initial', 'INIT-001', NOW()),
(5, 'IN', 120, 'Stock initial', 'INIT-001', NOW()),
-- Épicerie Sucrée
(11, 'IN', 100, 'Stock initial', 'INIT-002', NOW()),
(12, 'IN', 180, 'Stock initial', 'INIT-002', NOW()),
(13, 'IN', 90, 'Stock initial', 'INIT-002', NOW()),
-- Boissons
(17, 'IN', 250, 'Stock initial', 'INIT-003', NOW()),
(18, 'IN', 230, 'Stock initial', 'INIT-003', NOW()),
(19, 'IN', 100, 'Stock initial', 'INIT-003', NOW()),
-- Pâtisserie Orientale
(33, 'IN', 40, 'Stock initial', 'INIT-004', NOW()),
(34, 'IN', 50, 'Stock initial', 'INIT-004', NOW());

-- ========================================
-- ACCORDS DE PRIX SPÉCIAUX
-- ========================================
INSERT INTO customer_price_agreements (customer_id, product_id, special_price, valid_from, valid_until, created_at, updated_at) VALUES
-- Restaurant Le Méditerranée (gros volumes)
(1, 1, 2.49, '2026-01-01', '2026-12-31', NOW(), NOW()),  -- Couscous
(1, 2, 1.59, '2026-01-01', '2026-12-31', NOW(), NOW()),  -- Harissa
(1, 3, 6.95, '2026-01-01', '2026-12-31', NOW(), NOW()),  -- Huile d'olive
-- Épicerie du Quartier (revendeur)
(2, 4, 1.09, '2026-01-01', '2026-06-30', NOW(), NOW()),  -- Pâtes
(2, 17, 1.69, '2026-01-01', '2026-06-30', NOW(), NOW()), -- Coca-Cola
-- Snack Istanbul
(5, 33, 8.99, '2026-01-01', '2026-12-31', NOW(), NOW()); -- Baklava

-- ========================================
-- DOCUMENTS DE VENTE
-- ========================================

-- Facture pour Restaurant Le Méditerranée
INSERT INTO sale_documents (document_number, type, customer_id, document_date, due_date, total_amount, notes, status, created_at, updated_at) VALUES
('INV20260228-0001', 'INVOICE', 1, '2026-02-28', '2026-03-30', 0.00, 'Livraison hebdomadaire', 'SENT', NOW(), NOW());

INSERT INTO sale_document_lines (sale_document_id, product_id, quantity, unit_price, discount_percent, line_total) VALUES
(1, 1, 20, 2.49, 0.00, 49.80),   -- Couscous
(1, 2, 15, 1.59, 0.00, 23.85),   -- Harissa
(1, 3, 5, 6.95, 0.00, 34.75),    -- Huile d'olive
(1, 6, 10, 2.15, 0.00, 21.50);   -- Thon

UPDATE sale_documents SET total_amount = 129.90 WHERE id = 1;

-- Devis pour Épicerie du Quartier
INSERT INTO sale_documents (document_number, type, customer_id, document_date, due_date, total_amount, notes, status, created_at, updated_at) VALUES
('QUO20260228-0001', 'QUOTE', 2, '2026-02-28', '2026-03-15', 0.00, 'Commande mensuelle', 'DRAFT', NOW(), NOW());

INSERT INTO sale_document_lines (sale_document_id, product_id, quantity, unit_price, discount_percent, line_total) VALUES
(2, 4, 50, 1.09, 0.00, 54.50),   -- Pâtes
(2, 17, 30, 1.69, 0.00, 50.70),  -- Coca-Cola
(2, 11, 20, 5.95, 0.00, 119.00), -- Nutella
(2, 12, 25, 2.49, 0.00, 62.25);  -- Prince

UPDATE sale_documents SET total_amount = 286.45 WHERE id = 2;

-- Vente client particulier
INSERT INTO sale_documents (document_number, type, customer_id, document_date, due_date, total_amount, notes, status, created_at, updated_at) VALUES
('INV20260228-0002', 'INVOICE', 3, '2026-02-28', '2026-02-28', 0.00, 'Paiement comptant', 'PAID', NOW(), NOW());

INSERT INTO sale_document_lines (sale_document_id, product_id, quantity, unit_price, discount_percent, line_total) VALUES
(3, 33, 1, 9.99, 0.00, 9.99),    -- Baklava
(3, 15, 2, 4.50, 0.00, 9.00),    -- Dattes
(3, 21, 1, 2.49, 0.00, 2.49);    -- Thé menthe

UPDATE sale_documents SET total_amount = 21.48 WHERE id = 3;

-- ========================================
-- PAIEMENTS
-- ========================================
INSERT INTO payments (payment_number, payment_type, amount, payment_date, customer_id, reference, notes, validated, created_at, updated_at) VALUES
('PAY20260228-0001', 'BANK_TRANSFER', 129.90, '2026-02-28', 1, 'INV20260228-0001', 'Virement reçu', true, NOW(), NOW()),
('PAY20260228-0002', 'CASH', 21.48, '2026-02-28', 3, 'INV20260228-0002', 'Paiement comptant en magasin', true, NOW(), NOW());

-- ========================================
-- DOCUMENTS D'ACHAT
-- ========================================

-- Bon de commande Metro
INSERT INTO purchase_documents (document_number, type, supplier_id, document_date, due_date, total_amount, notes, status, stock_updated, created_at, updated_at) VALUES
('PO20260225-0001', 'ORDER', 1, '2026-02-25', '2026-03-10', 0.00, 'Commande mensuelle', 'SENT', false, NOW(), NOW());

INSERT INTO purchase_document_lines (purchase_document_id, product_id, quantity, unit_price, line_total) VALUES
(1, 4, 100, 0.95, 95.00),   -- Pâtes
(1, 17, 50, 1.45, 72.50),   -- Coca
(1, 11, 30, 4.50, 135.00);  -- Nutella

UPDATE purchase_documents SET total_amount = 302.50 WHERE id = 1;

-- Réception Importation Orientale
INSERT INTO purchase_documents (document_number, type, supplier_id, document_date, due_date, total_amount, notes, status, stock_updated, created_at, updated_at) VALUES
('REC20260226-0001', 'RECEIPT', 2, '2026-02-26', '2026-04-10', 0.00, 'Livraison produits orientaux', 'RECEIVED', true, NOW(), NOW());

INSERT INTO purchase_document_lines (purchase_document_id, product_id, quantity, unit_price, line_total) VALUES
(2, 1, 50, 2.20, 110.00),   -- Couscous
(2, 2, 100, 1.40, 140.00),  -- Harissa
(2, 33, 20, 7.50, 150.00),  -- Baklava
(2, 34, 25, 4.80, 120.00);  -- Makrout

UPDATE purchase_documents SET total_amount = 520.00 WHERE id = 2;

-- ========================================
-- COMPTES FINANCIERS
-- ========================================
INSERT INTO financial_accounts (account_number, account_name, account_type, balance, currency, description, active, created_at, updated_at) VALUES
('BE68539007547034', 'Compte Courant Principal', 'BANK', 15000.00, 'EUR', 'Compte bancaire BNP Paribas Fortis', true, NOW(), NOW()),
('CAISSE-001', 'Caisse Magasin', 'CASH', 2500.00, 'EUR', 'Caisse enregistreuse principale', true, NOW(), NOW()),
('EPARGNE-001', 'Compte Épargne', 'SAVINGS', 8000.00, 'EUR', 'Réserve financière', true, NOW(), NOW());

-- ========================================
-- TRANSACTIONS FINANCIÈRES
-- ========================================
INSERT INTO financial_transactions (transaction_number, account_id, created_by_id, validated_by_id, transaction_type, amount, transaction_date, description, reference, category, applied, notes, created_at, updated_at) VALUES
-- Encaissement virement Restaurant
('TXN20260228-000001', 1, 3, 2, 'CREDIT', 129.90, '2026-02-28', 'Paiement Restaurant Le Méditerranée', 'PAY20260228-0001', 'VENTE', true, 'Virement bancaire', NOW(), NOW()),
-- Encaissement cash client particulier
('TXN20260228-000002', 2, 3, 3, 'CREDIT', 21.48, '2026-02-28', 'Vente Mme Boutari', 'PAY20260228-0002', 'VENTE', true, 'Paiement comptant', NOW(), NOW()),
-- Paiement fournisseur Metro
('TXN20260227-000001', 1, 2, 2, 'DEBIT', 302.50, '2026-02-27', 'Paiement fournisseur Metro', 'PO20260225-0001', 'ACHAT', true, 'Virement vers Metro', NOW(), NOW()),
-- Paiement fournisseur Import Oriental
('TXN20260226-000001', 1, 2, 1, 'DEBIT', 520.00, '2026-02-26', 'Paiement Importation Orientale', 'REC20260226-0001', 'ACHAT', true, 'Virement 45 jours', NOW(), NOW()),
-- Retrait pour versement caisse
('TXN20260228-000003', 1, 2, 2, 'DEBIT', 500.00, '2026-02-28', 'Approvisionnement caisse', 'TRANSFER-001', 'INTERNAL', true, 'Transfert vers caisse', NOW(), NOW()),
('TXN20260228-000004', 2, 2, 2, 'CREDIT', 500.00, '2026-02-28', 'Approvisionnement caisse', 'TRANSFER-001', 'INTERNAL', true, 'Transfert depuis compte', NOW(), NOW());

-- ========================================
-- MISE À JOUR DES SOLDES FINAUX
-- ========================================

-- Mise à jour du solde du compte bancaire
-- 15000 + 129.90 + 21.48 - 302.50 - 520.00 - 500.00 = 13828.88
UPDATE financial_accounts SET balance = 13828.88 WHERE id = 1;

-- Mise à jour du solde de la caisse
-- 2500 + 21.48 + 500 = 3021.48
UPDATE financial_accounts SET balance = 3021.48 WHERE id = 2;

-- ========================================
-- FIN DU SCRIPT
-- ========================================

-- Vérification des données insérées
SELECT 'Utilisateurs' as Table_Name, COUNT(*) as Nombre FROM users
UNION ALL
SELECT 'Catégories', COUNT(*) FROM categories
UNION ALL
SELECT 'Produits', COUNT(*) FROM products
UNION ALL
SELECT 'Clients', COUNT(*) FROM customers
UNION ALL
SELECT 'Fournisseurs', COUNT(*) FROM suppliers
UNION ALL
SELECT 'Mouvements Stock', COUNT(*) FROM stock_movements
UNION ALL
SELECT 'Accords Prix', COUNT(*) FROM customer_price_agreements
UNION ALL
SELECT 'Documents Vente', COUNT(*) FROM sale_documents
UNION ALL
SELECT 'Lignes Vente', COUNT(*) FROM sale_document_lines
UNION ALL
SELECT 'Documents Achat', COUNT(*) FROM purchase_documents
UNION ALL
SELECT 'Lignes Achat', COUNT(*) FROM purchase_document_lines
UNION ALL
SELECT 'Paiements', COUNT(*) FROM payments
UNION ALL
SELECT 'Comptes Financiers', COUNT(*) FROM financial_accounts
UNION ALL
SELECT 'Transactions Financières', COUNT(*) FROM financial_transactions;