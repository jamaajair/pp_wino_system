-- ========================================
-- SCRIPT D'INSERTION DE DONNÉES DE TEST
-- Thème : MB Food - Alimentation Générale
-- ========================================

-- ========================================
-- NETTOYAGE COMPLET ET RESET DES SÉQUENCES
-- ========================================
TRUNCATE TABLE
    financial_transactions,
    financial_accounts,
    payments,
    sale_document_lines,
    sale_documents,
    purchase_document_lines,
    purchase_documents,
    customer_price_agreements,
    stock_movements,
    suppliers,
    customers,
    products,
    categories,
    users
RESTART IDENTITY CASCADE;

-- ========================================
-- UTILISATEURS
-- ========================================
INSERT INTO users (username, password, email, first_name, last_name, phone, role, active, created_at, updated_at) VALUES
('admin', 'admin123', 'admin@mbfood.be', 'Mohammed', 'Benali', '+32470123456', 'ADMIN', true, NOW(), NOW()),
('manager', 'manager123', 'manager@mbfood.be', 'Fatima', 'El Amrani', '+32471234567', 'MANAGER', true, NOW(), NOW()),
('vendeur1', 'vendeur123', 'vendeur@mbfood.be', 'Hassan', 'Bouazza', '+32472345678', 'SALES', true, NOW(), NOW()),
('magasinier', 'magasin123', 'stock@mbfood.be', 'Karim', 'Ziani', '+32473456789', 'WAREHOUSE', true, NOW(), NOW()),
('client1', 'client123', 'client@mbfood.be', 'Amina', 'Boutari', '+32470000001', 'CUSTOMER', true, NOW(), NOW());

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
INSERT INTO products (code, name, description, sale_price, purchase_price, stock_quantity, tva, qte_colis, active, category_id, created_at, updated_at) VALUES
('PRD001', 'Couscous Ferrero 1kg', 'Couscous grain moyen qualité supérieure', 2.99, 2.20, 150, 6, 10, true, 1, NOW(), NOW()),
('PRD002', 'Harissa Cap Bon 210g', 'Pâte de piment rouge traditionnelle tunisienne', 1.89, 1.40, 200, 6, 24, true, 1, NOW(), NOW()),
('PRD003', 'Huile d''Olive Extra Vierge 1L', 'Huile d''olive première pression à froid', 7.95, 6.00, 80, 6, 6, true, 1, NOW(), NOW()),
('PRD004', 'Pâtes Barilla Spaghetti 500g', 'Pâtes italiennes blé dur', 1.29, 0.95, 300, 6, 20, true, 1, NOW(), NOW()),
('PRD005', 'Riz Basmati Uncle Ben''s 1kg', 'Riz long grain parfumé', 3.49, 2.60, 120, 6, 10, true, 1, NOW(), NOW()),
('PRD006', 'Thon à l''Huile Mabrouka 160g', 'Thon entier à l''huile d''olive', 2.15, 1.60, 180, 6, 24, true, 1, NOW(), NOW()),
('PRD007', 'Sardines à l''Huile 125g', 'Sardines portugaises de qualité', 1.65, 1.20, 220, 6, 24, true, 1, NOW(), NOW()),
('PRD008', 'Concentré de Tomate 210g', 'Double concentré de tomate', 0.99, 0.70, 250, 6, 24, true, 1, NOW(), NOW()),
('PRD009', 'Pois Chiches Goya 400g', 'Pois chiches en conserve', 1.19, 0.85, 160, 6, 12, true, 1, NOW(), NOW()),
('PRD010', 'Miel d''Acacia 500g', 'Miel pur et naturel', 8.50, 6.00, 60, 6, 12, true, 1, NOW(), NOW()),

-- Épicerie Sucrée
('PRD011', 'Nutella 750g', 'Pâte à tartiner aux noisettes et cacao', 5.95, 4.50, 100, 6, 6, true, 2, NOW(), NOW()),
('PRD012', 'Biscuits Prince Chocolat', 'Biscuits fourrés au chocolat', 2.49, 1.80, 180, 6, 12, true, 2, NOW(), NOW()),
('PRD013', 'Confiture Bonne Maman Fraise 370g', 'Confiture de fraises', 3.29, 2.40, 90, 6, 12, true, 2, NOW(), NOW()),
('PRD014', 'Chocolat Milka Noisettes 100g', 'Chocolat au lait et noisettes entières', 1.79, 1.20, 200, 6, 20, true, 2, NOW(), NOW()),
('PRD015', 'Dattes Deglet Nour 500g', 'Dattes naturelles d''Algérie', 4.50, 3.20, 70, 6, 12, true, 2, NOW(), NOW()),
('PRD016', 'Halva Pistache 400g', 'Confiserie orientale au sésame et pistaches', 5.99, 4.20, 50, 6, 12, true, 2, NOW(), NOW()),

-- Boissons
('PRD017', 'Coca-Cola 1.5L', 'Boisson gazeuse', 1.89, 1.45, 250, 21, 6, true, 3, NOW(), NOW()),
('PRD018', 'Fanta Orange 1.5L', 'Boisson gazeuse saveur orange', 1.75, 1.30, 230, 21, 6, true, 3, NOW(), NOW()),
('PRD019', 'Eau Spa Reine 6x1.5L', 'Eau minérale plate pack de 6', 3.99, 2.80, 100, 6, 4, true, 3, NOW(), NOW()),
('PRD020', 'Jus d''Orange Tropicana 1L', 'Pur jus d''orange sans sucres ajoutés', 2.95, 2.10, 140, 6, 12, true, 3, NOW(), NOW()),
('PRD021', 'Thé Vert à la Menthe 25 sachets', 'Infusion orientale menthe et thé vert', 2.49, 1.70, 120, 6, 12, true, 3, NOW(), NOW()),
('PRD022', 'Café Carte Noire Moulu 250g', 'Café arabica moulu', 4.25, 3.00, 80, 6, 12, true, 3, NOW(), NOW()),

-- Produits Frais
('PRD023', 'Lait Demi-Écrémé Inex 1L', 'Lait frais belge', 1.15, 0.80, 180, 6, 12, true, 4, NOW(), NOW()),
('PRD024', 'Yaourt Nature Danone x8', 'Yaourt nature crémeux', 2.79, 2.00, 150, 6, 6, true, 4, NOW(), NOW()),
('PRD025', 'Beurre Doux Président 250g', 'Beurre de baratte AOP', 2.99, 2.20, 100, 6, 20, true, 4, NOW(), NOW()),
('PRD026', 'Fromage Gouda Tranché 200g', 'Fromage hollandais tranches', 2.49, 1.80, 90, 6, 12, true, 4, NOW(), NOW()),
('PRD027', 'Oeufs Frais x12', 'Oeufs de poules élevées en plein air', 3.49, 2.50, 120, 6, 10, true, 4, NOW(), NOW()),

-- Hygiène & Entretien
('PRD028', 'Lessive Ariel Liquide 2L', 'Lessive liquide 40 lavages', 8.95, 6.50, 70, 21, 6, true, 5, NOW(), NOW()),
('PRD029', 'Papier Toilette Lotus x12', 'Papier toilette triple épaisseur', 5.49, 3.80, 100, 21, 5, true, 5, NOW(), NOW()),
('PRD030', 'Liquide Vaisselle Fairy 500ml', 'Liquide vaisselle citron', 2.99, 2.10, 120, 21, 12, true, 5, NOW(), NOW()),
('PRD031', 'Savon de Marseille 400g', 'Savon traditionnel multi-usages', 3.95, 2.80, 80, 21, 12, true, 5, NOW(), NOW()),

-- Snacks & Apéritifs
('PRD032', 'Chips Lay''s Paprika 200g', 'Chips saveur paprika', 2.29, 1.60, 200, 6, 12, true, 6, NOW(), NOW()),
('PRD033', 'Cacahuètes Grillées Salées 500g', 'Cacahuètes apéritif', 2.99, 2.10, 150, 6, 12, true, 6, NOW(), NOW()),
('PRD034', 'Olives Vertes Dénoyautées 370g', 'Olives vertes en saumure', 2.49, 1.70, 110, 6, 12, true, 6, NOW(), NOW()),
('PRD035', 'Pistaches Grillées 200g', 'Pistaches naturelles salées', 5.95, 4.20, 80, 6, 12, true, 6, NOW(), NOW()),

-- Pâtisserie Orientale
('PRD036', 'Baklava aux Amandes 500g', 'Pâtisserie feuilletée au miel et amandes', 9.99, 7.50, 40, 6, 6, true, 7, NOW(), NOW()),
('PRD037', 'Makrout aux Dattes 400g', 'Gâteau semoule fourré aux dattes', 6.50, 4.80, 50, 6, 6, true, 7, NOW(), NOW()),
('PRD038', 'Cornes de Gazelle 300g', 'Pâtisserie marocaine aux amandes', 7.95, 5.80, 35, 6, 6, true, 7, NOW(), NOW()),
('PRD039', 'Zlabiya au Miel 500g', 'Beignets orientaux au miel', 5.99, 4.20, 45, 6, 6, true, 7, NOW(), NOW()),

-- Produits du Monde
('PRD040', 'Sauce Piquante Sriracha 430g', 'Sauce pimentée asiatique', 3.49, 2.50, 90, 6, 12, true, 8, NOW(), NOW()),
('PRD041', 'Lait de Coco 400ml', 'Lait de coco cuisine asiatique', 1.99, 1.40, 130, 6, 12, true, 8, NOW(), NOW()),
('PRD042', 'Vermicelles de Riz 400g', 'Nouilles asiatiques', 2.29, 1.60, 110, 6, 12, true, 8, NOW(), NOW()),
('PRD043', 'Pâte de Curry Vert 50g', 'Pâte thaïlandaise épicée', 2.79, 1.90, 70, 6, 24, true, 8, NOW(), NOW());

-- ========================================
-- CLIENTS
-- ========================================
INSERT INTO customers (code, name, email, phone, address, city, postal_code, country, tax_id, customer_type, credit_limit, balance, active, created_at, updated_at) VALUES
('CLI001', 'Restaurant Le Méditerranée', 'contact@lemediterranee.be', '+3243001234', 'Rue de la Cathédrale 12', 'Liège', '4000', 'Belgique', 'BE0123456789', 'COMPANY', 5000.00, 0.00, true, NOW(), NOW()),
('CLI002', 'Épicerie du Quartier', 'epicerie@quartier.be', '+3243112233', 'Boulevard de la Constitution 45', 'Liège', '4020', 'Belgique', 'BE0234567890', 'COMPANY', 3000.00, 0.00, true, NOW(), NOW()),
('CLI003', 'Madame Amina Boutari', 'amina.boutari@gmail.com', '+32470000001', 'Rue Haute 23', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, NOW(), NOW()),
('CLI004', 'Snack Istanbul', 'istanbul@snack.be', '+3243223344', 'Rue du Pot d''Or 8', 'Liège', '4000', 'Belgique', 'BE0345678901', 'COMPANY', 2000.00, 0.00, true, NOW(), NOW()),
('CLI005', 'Boulangerie Al Forn', 'alforn@boulangerie.be', '+3243334455', 'Chaussée de Tongres 102', 'Liège', '4000', 'Belgique', 'BE0456789012', 'COMPANY', 2500.00, 0.00, true, NOW(), NOW()),
('CLI006', 'Monsieur Mathieu Adam', 'mathieu.adam@gmail.com', '+32475108603', 'Boulevard du Midi 71', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-04-02 00:00:00', '2021-04-02 00:00:00'),
('CLI007', 'Épicerie du Terroir', 'epicerie.du@outlook.com', '+32471445199', 'Chaussée de Namur 155', 'Louvain', '3000', 'Belgique', 'BE969119330', 'COMPANY', 5000.00, 39.77, true, '2023-02-23 00:00:00', '2023-02-23 00:00:00'),
('CLI008', 'Brasserie de la Place', 'brasserie.de@gmail.com', '+32476708456', 'Rue de Stassart 109', 'Anvers', '2000', 'Belgique', 'BE485451171', 'COMPANY', 5000.00, 0.00, true, '2021-07-23 00:00:00', '2021-07-23 00:00:00'),
('CLI009', 'Brasserie Chez Momo', 'brasserie.chez@telenet.be', '+32478707870', 'Chaussée de Wavre 12', 'Hasselt', '3500', 'Belgique', 'BE774996843', 'COMPANY', 3000.00, 24.97, true, '2023-01-03 00:00:00', '2023-01-03 00:00:00'),
('CLI010', 'Monsieur Thomas Hajji', 'thomas.hajji@outlook.com', '+32472166941', 'Avenue des Anglais 50', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-04-03 00:00:00', '2020-04-03 00:00:00'),
('CLI011', 'Monsieur Walid Simon', 'walid.simon@yahoo.fr', '+32476960453', 'Rue Haute 95', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-03-05 00:00:00', '2021-03-05 00:00:00'),
('CLI012', 'Épicerie La Palme', 'epicerie.la@telenet.be', '+32476440561', 'Avenue de la Reine 176', 'Tournai', '7500', 'Belgique', 'BE438715135', 'COMPANY', 2500.00, 0.00, true, '2024-09-22 00:00:00', '2024-09-22 00:00:00'),
('CLI013', 'Friterie Al Madina', 'friterie.al@hotmail.com', '+32476279418', 'Rue du Fossé aux Loups 242', 'Mons', '7000', 'Belgique', 'BE384412919', 'COMPANY', 1500.00, 131.09, true, '2021-03-11 00:00:00', '2021-03-11 00:00:00'),
('CLI014', 'Café Al Baraka', 'cafe.al@gmail.com', '+32478187926', 'Rue du Commerce 68', 'Tournai', '7500', 'Belgique', 'BE911514914', 'COMPANY', 1000.00, 0.00, true, '2023-04-10 00:00:00', '2023-04-10 00:00:00'),
('CLI015', 'Madame Dounia Laurent', 'dounia.laurent@skynet.be', '+32478082668', 'Rue de Bruxelles 41', 'Gand', '9000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 12.71, true, '2023-05-06 00:00:00', '2023-05-06 00:00:00'),
('CLI016', 'Madame Khadija Garcia', 'khadija.garcia@hotmail.com', '+32472921859', 'Avenue Coghen 185', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-10-28 00:00:00', '2023-10-28 00:00:00'),
('CLI017', 'Monsieur Zakaria Rousseau', 'zakaria.rousseau@hotmail.com', '+32473997281', 'Chaussée de Namur 196', 'Hasselt', '3500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-11-05 00:00:00', '2022-11-05 00:00:00'),
('CLI018', 'Madame Aurélie Benali', 'aurelie.benali@skynet.be', '+32476438436', 'Rue du Fossé aux Loups 1', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-09-27 00:00:00', '2022-09-27 00:00:00'),
('CLI019', 'Monsieur Nabil Tazi', 'nabil.tazi@outlook.com', '+32472161193', 'Boulevard du Midi 125', 'Charleroi', '6000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-04-06 00:00:00', '2024-04-06 00:00:00'),
('CLI020', 'Madame Charlotte Rousseau', 'charlotte.rousseau@skynet.be', '+32474553384', 'Avenue Blonden 247', 'Arlon', '6700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-01-09 00:00:00', '2023-01-09 00:00:00'),
('CLI021', 'Monsieur Ahmed Ziani', 'ahmed.ziani@proximus.be', '+32476672134', 'Avenue de la Reine 17', 'Louvain', '3000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-02-13 00:00:00', '2020-02-13 00:00:00'),
('CLI022', 'Alimentation Saveurs d''Orient', 'alimentation.saveurs@skynet.be', '+32476543670', 'Boulevard Anspach 9', 'Charleroi', '6000', 'Belgique', 'BE242068763', 'COMPANY', 4000.00, 0.00, true, '2020-05-25 00:00:00', '2020-05-25 00:00:00'),
('CLI023', 'Monsieur Hamza Hajji', 'hamza.hajji@yahoo.fr', '+32475076817', 'Avenue des Anglais 122', 'Mouscron', '7700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 94.59, true, '2024-05-25 00:00:00', '2024-05-25 00:00:00'),
('CLI024', 'Restaurant Méditerranée', 'restaurant.mediterranee@outlook.com', '+32471908841', 'Rue Grétry 222', 'Liège', '4020', 'Belgique', 'BE959629660', 'COMPANY', 5000.00, 0.00, true, '2023-10-11 00:00:00', '2023-10-11 00:00:00'),
('CLI025', 'Pâtisserie du Parc', 'patisserie.du@gmail.com', '+32478526486', 'Rue Basse 138', 'Mons', '7000', 'Belgique', 'BE575808013', 'COMPANY', 5000.00, 0.00, true, '2020-10-14 00:00:00', '2020-10-14 00:00:00'),
('CLI026', 'Monsieur Maxime Ouali', 'maxime.ouali@hotmail.com', '+32471247595', 'Chaussée de Charleroi 13', 'Tournai', '7500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-07-10 00:00:00', '2020-07-10 00:00:00'),
('CLI027', 'Madame Manon Tazi', 'manon.tazi@proximus.be', '+32471036161', 'Rue Haute 98', 'Bruxelles', '1050', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 53.04, true, '2022-03-10 00:00:00', '2022-03-10 00:00:00'),
('CLI028', 'Madame Samira Benali', 'samira.benali@yahoo.fr', '+32471981186', 'Place Saint-Lambert 56', 'Mons', '7000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-04-01 00:00:00', '2023-04-01 00:00:00'),
('CLI029', 'Monsieur David Muller', 'david.muller@skynet.be', '+32479519948', 'Rue Haute 15', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-06-13 00:00:00', '2020-06-13 00:00:00'),
('CLI030', 'Friterie des Artistes', 'friterie.des@proximus.be', '+32472375453', 'Avenue Louise 159', 'Arlon', '6700', 'Belgique', 'BE869005091', 'COMPANY', 2000.00, 0.00, true, '2022-05-08 00:00:00', '2022-05-08 00:00:00'),
('CLI031', 'Restaurant du Terroir', 'restaurant.du@skynet.be', '+32476033115', 'Boulevard d''Avroy 172', 'Herstal', '4040', 'Belgique', 'BE207354053', 'COMPANY', 1000.00, 0.00, true, '2022-07-25 00:00:00', '2022-07-25 00:00:00'),
('CLI032', 'Madame Julie Martin', 'julie.martin@telenet.be', '+32476855396', 'Rue du Marché 34', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-12-09 00:00:00', '2024-12-09 00:00:00'),
('CLI033', 'Monsieur Bilal Laurent', 'bilal.laurent@gmail.com', '+32479874152', 'Rue des Mineurs 207', 'Bruges', '8000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-01-17 00:00:00', '2020-01-17 00:00:00'),
('CLI034', 'Madame Camille Benali', 'camille.benali@proximus.be', '+32474533779', 'Rue du Marché 73', 'Gand', '9000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-01-09 00:00:00', '2024-01-09 00:00:00'),
('CLI035', 'Café La Maison', 'cafe.la@skynet.be', '+32476596150', 'Avenue Louise 1', 'Hasselt', '3500', 'Belgique', 'BE857704655', 'COMPANY', 2500.00, 0.00, true, '2024-04-28 00:00:00', '2024-04-28 00:00:00'),
('CLI036', 'Monsieur Florian Moussaoui', 'florian.moussaoui@outlook.com', '+32473500715', 'Rue des Guillemins 242', 'Namur', '5000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-01-22 00:00:00', '2023-01-22 00:00:00'),
('CLI037', 'Traiteur Le Jardin', 'traiteur.le@telenet.be', '+32474524499', 'Boulevard Anspach 92', 'Bruxelles', '1050', 'Belgique', 'BE536344399', 'COMPANY', 3000.00, 0.00, true, '2023-10-28 00:00:00', '2023-10-28 00:00:00'),
('CLI038', 'Madame Lucie Simon', 'lucie.simon@hotmail.com', '+32473970445', 'Rue Neuve 42', 'Louvain', '3000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-12-10 00:00:00', '2024-12-10 00:00:00'),
('CLI039', 'Madame Hafsa David', 'hafsa.david@telenet.be', '+32471649691', 'Rue de Namur 224', 'Namur', '5000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-10-24 00:00:00', '2024-10-24 00:00:00'),
('CLI040', 'Madame Hafsa Chaoui', 'hafsa.chaoui@proximus.be', '+32474240180', 'Rue de la Paix 169', 'Louvain', '3000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-03-27 00:00:00', '2022-03-27 00:00:00'),
('CLI041', 'Monsieur Mathieu Laurent', 'mathieu.laurent@gmail.com', '+32471463060', 'Rue Léopold 241', 'Tournai', '7500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-08-24 00:00:00', '2020-08-24 00:00:00'),
('CLI042', 'Madame Léa Bernard', 'lea.bernard@gmail.com', '+32476262632', 'Boulevard du Midi 202', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-06-12 00:00:00', '2022-06-12 00:00:00'),
('CLI043', 'Madame Khadija David', 'khadija.david@outlook.com', '+32474305700', 'Chaussée de Namur 237', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-01-15 00:00:00', '2022-01-15 00:00:00'),
('CLI044', 'Madame Sophie Slimani', 'sophie.slimani@outlook.com', '+32475960271', 'Rue de Namur 179', 'Verviers', '4800', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 25.46, true, '2023-02-09 00:00:00', '2023-02-09 00:00:00'),
('CLI045', 'Pâtisserie du Terroir', 'patisserie.du@proximus.be', '+32474526280', 'Place Saint-Lambert 74', 'Liège', '4000', 'Belgique', 'BE329460134', 'COMPANY', 3000.00, 0.00, true, '2022-05-30 00:00:00', '2022-05-30 00:00:00'),
('CLI046', 'Monsieur David David', 'david.david@telenet.be', '+32475761145', 'Avenue Coghen 22', 'Anvers', '2000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-11-21 00:00:00', '2022-11-21 00:00:00'),
('CLI047', 'Pâtisserie Anatolie', 'patisserie.anatolie@proximus.be', '+32478971465', 'Avenue Louise 63', 'Liège', '4000', 'Belgique', 'BE718121922', 'COMPANY', 1500.00, 0.00, true, '2023-06-05 00:00:00', '2023-06-05 00:00:00'),
('CLI048', 'Monsieur Florian Moreau', 'florian.moreau@telenet.be', '+32475093379', 'Rue de Liège 103', 'Herstal', '4040', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-10-29 00:00:00', '2020-10-29 00:00:00'),
('CLI049', 'Madame Dounia Tazi', 'dounia.tazi@outlook.com', '+32475180853', 'Rue Grétry 13', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-10-03 00:00:00', '2024-10-03 00:00:00'),
('CLI050', 'Monsieur Nabil Renard', 'nabil.renard@telenet.be', '+32479468772', 'Rue des Mineurs 209', 'Liège', '4030', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 166.11, true, '2022-05-23 00:00:00', '2022-05-23 00:00:00'),
('CLI051', 'Pâtisserie de la Place', 'patisserie.de@outlook.com', '+32479745959', 'Rue Verte 200', 'Hasselt', '3500', 'Belgique', 'BE351785565', 'COMPANY', 2000.00, 0.00, true, '2022-09-19 00:00:00', '2022-09-19 00:00:00'),
('CLI052', 'Grocery Maghreb', 'grocery.maghreb@yahoo.fr', '+32473530518', 'Rue des Guillemins 36', 'Tournai', '7500', 'Belgique', 'BE537656494', 'COMPANY', 2000.00, 0.00, true, '2021-04-18 00:00:00', '2021-04-18 00:00:00'),
('CLI053', 'Madame Hana Boutari', 'hana.boutari@outlook.com', '+32478048838', 'Avenue Louise 53', 'Liège', '4020', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-03-08 00:00:00', '2022-03-08 00:00:00'),
('CLI054', 'Pâtisserie du Parc', 'patisserie.du@yahoo.fr', '+32478030010', 'Rue Neuve 229', 'Herstal', '4040', 'Belgique', 'BE621454127', 'COMPANY', 1000.00, 0.00, true, '2023-01-07 00:00:00', '2023-01-07 00:00:00'),
('CLI055', 'Friterie Méditerranée', 'friterie.mediterranee@skynet.be', '+32478841505', 'Boulevard du Midi 43', 'Herstal', '4040', 'Belgique', 'BE811890569', 'COMPANY', 1000.00, 0.00, true, '2020-09-18 00:00:00', '2020-09-18 00:00:00'),
('CLI056', 'Traiteur Maghreb', 'traiteur.maghreb@outlook.com', '+32478746014', 'Boulevard d''Avroy 222', 'Liège', '4020', 'Belgique', 'BE462388455', 'COMPANY', 5000.00, 10.06, true, '2021-01-07 00:00:00', '2021-01-07 00:00:00'),
('CLI057', 'Monsieur Walid Benali', 'walid.benali@outlook.com', '+32478072684', 'Rue Verte 244', 'Hasselt', '3500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 166.98, true, '2021-05-31 00:00:00', '2021-05-31 00:00:00'),
('CLI058', 'Épicerie La Palme', 'epicerie.la@skynet.be', '+32471675419', 'Rue Verte 246', 'Charleroi', '6000', 'Belgique', 'BE263619298', 'COMPANY', 1500.00, 0.00, true, '2024-03-24 00:00:00', '2024-03-24 00:00:00'),
('CLI059', 'Café La Bonne Table', 'cafe.la@proximus.be', '+32474656838', 'Avenue des Anglais 243', 'Namur', '5000', 'Belgique', 'BE871330207', 'COMPANY', 1000.00, 0.00, true, '2022-08-10 00:00:00', '2022-08-10 00:00:00'),
('CLI060', 'Madame Isabelle Ziani', 'isabelle.ziani@proximus.be', '+32471430812', 'Place Saint-Lambert 28', 'Anvers', '2000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 115.16, true, '2021-09-30 00:00:00', '2021-09-30 00:00:00'),
('CLI061', 'Monsieur Mustafa Karimi', 'mustafa.karimi@proximus.be', '+32476059717', 'Chaussée de Charleroi 179', 'Louvain', '3000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-10-07 00:00:00', '2024-10-07 00:00:00'),
('CLI062', 'Brasserie Anatolie', 'brasserie.anatolie@outlook.com', '+32471212267', 'Rue de Bruxelles 88', 'Wavre', '1300', 'Belgique', 'BE782454310', 'COMPANY', 5000.00, 84.01, true, '2024-10-05 00:00:00', '2024-10-05 00:00:00'),
('CLI063', 'Madame Manon Bouhali', 'manon.bouhali@outlook.com', '+32479753457', 'Avenue Blonden 46', 'Gand', '9000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 54.02, true, '2023-08-25 00:00:00', '2023-08-25 00:00:00'),
('CLI064', 'Madame Fatima Ouali', 'fatima.ouali@outlook.com', '+32478563202', 'Rue du Marché 226', 'Charleroi', '6000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 150.10, true, '2021-05-14 00:00:00', '2021-05-14 00:00:00'),
('CLI065', 'Superette Le Soleil', 'superette.le@hotmail.com', '+32475334434', 'Boulevard de la Sauvenière 205', 'Mons', '7000', 'Belgique', 'BE191926217', 'COMPANY', 1500.00, 0.00, true, '2021-11-28 00:00:00', '2021-11-28 00:00:00'),
('CLI066', 'Madame Fatima Rachidi', 'fatima.rachidi@hotmail.com', '+32475031966', 'Rue du Commerce 195', 'Ottignies', '1340', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 95.22, true, '2023-11-15 00:00:00', '2023-11-15 00:00:00'),
('CLI067', 'Boulangerie La Maison', 'boulangerie.la@outlook.com', '+32477191135', 'Place Saint-Lambert 170', 'Louvain', '3000', 'Belgique', 'BE477753674', 'COMPANY', 4000.00, 0.00, true, '2022-08-27 00:00:00', '2022-08-27 00:00:00'),
('CLI068', 'Monsieur Marc Leroy', 'marc.leroy@yahoo.fr', '+32473024269', 'Rue du Marché 60', 'Bruges', '8000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-01-17 00:00:00', '2024-01-17 00:00:00'),
('CLI069', 'Épicerie du Nord', 'epicerie.du184@outlook.com', '+32475747930', 'Rue Verte 135', 'Mouscron', '7700', 'Belgique', 'BE115191689', 'COMPANY', 4000.00, 0.00, true, '2020-07-24 00:00:00', '2020-07-24 00:00:00'),
('CLI070', 'Madame Zineb Boutari', 'zineb.boutari@outlook.com', '+32471914794', 'Avenue Louise 250', 'Hasselt', '3500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-02-07 00:00:00', '2023-02-07 00:00:00'),
('CLI071', 'Monsieur Omar Muller', 'omar.muller@gmail.com', '+32471861958', 'Rue Léopold 48', 'Liège', '4030', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 188.21, true, '2021-06-01 00:00:00', '2021-06-01 00:00:00'),
('CLI072', 'Madame Alice Nadri', 'alice.nadri@skynet.be', '+32476097514', 'Boulevard d''Avroy 39', 'Bruxelles', '1050', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-06-23 00:00:00', '2020-06-23 00:00:00'),
('CLI073', 'Snack Le Délice', 'snack.le@gmail.com', '+32478427625', 'Rue de Namur 116', 'Wavre', '1300', 'Belgique', 'BE754586204', 'COMPANY', 4000.00, 172.03, true, '2021-08-31 00:00:00', '2021-08-31 00:00:00'),
('CLI074', 'Café Chez Momo', 'cafe.chez@hotmail.com', '+32475440025', 'Rue de Bruxelles 55', 'Mons', '7000', 'Belgique', 'BE102873038', 'COMPANY', 2500.00, 0.00, true, '2023-09-14 00:00:00', '2023-09-14 00:00:00'),
('CLI075', 'Madame Leila Moreau', 'leila.moreau@outlook.com', '+32471547605', 'Rue de Liège 75', 'Arlon', '6700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-04-19 00:00:00', '2021-04-19 00:00:00'),
('CLI076', 'Monsieur Antoine Bakkali', 'antoine.bakkali@gmail.com', '+32474318855', 'Avenue Coghen 206', 'Mouscron', '7700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-05-20 00:00:00', '2022-05-20 00:00:00'),
('CLI077', 'Grocery Méditerranée', 'grocery.mediterranee@outlook.com', '+32475842082', 'Rue des Mineurs 192', 'Bruges', '8000', 'Belgique', 'BE637377910', 'COMPANY', 3000.00, 0.00, true, '2022-06-18 00:00:00', '2022-06-18 00:00:00'),
('CLI078', 'Monsieur Rachid Moreau', 'rachid.moreau@proximus.be', '+32478248238', 'Rue des Mineurs 11', 'Charleroi', '6000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-02-13 00:00:00', '2024-02-13 00:00:00'),
('CLI079', 'Monsieur Pierre Amrani', 'pierre.amrani@proximus.be', '+32471348050', 'Avenue des Anglais 244', 'Mouscron', '7700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-04-15 00:00:00', '2024-04-15 00:00:00'),
('CLI080', 'Pâtisserie du Nord', 'patisserie.du@outlook.com', '+32478312936', 'Rue Haute 150', 'Hasselt', '3500', 'Belgique', 'BE444733679', 'COMPANY', 4000.00, 0.00, true, '2023-07-24 00:00:00', '2023-07-24 00:00:00'),
('CLI081', 'Kebab House Le Jardin', 'kebabhouse.le@gmail.com', '+32479312590', 'Rue Léopold 106', 'Anvers', '2000', 'Belgique', 'BE588365604', 'COMPANY', 1000.00, 132.52, true, '2021-08-13 00:00:00', '2021-08-13 00:00:00'),
('CLI082', 'Alimentation Le Palmier', 'alimentation.le@yahoo.fr', '+32477780932', 'Chaussée de Charleroi 249', 'Verviers', '4800', 'Belgique', 'BE543721204', 'COMPANY', 1000.00, 0.00, true, '2024-11-06 00:00:00', '2024-11-06 00:00:00'),
('CLI083', 'Épicerie des Artistes', 'epicerie.des@hotmail.com', '+32479363326', 'Rue des Mineurs 194', 'Seraing', '4100', 'Belgique', 'BE409268943', 'COMPANY', 2500.00, 0.00, true, '2023-07-04 00:00:00', '2023-07-04 00:00:00'),
('CLI084', 'Madame Yasmine Moreau', 'yasmine.moreau@gmail.com', '+32475014745', 'Chaussée de Charleroi 8', 'Ottignies', '1340', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-12-24 00:00:00', '2023-12-24 00:00:00'),
('CLI085', 'Madame Lucie Amrani', 'lucie.amrani@hotmail.com', '+32473583206', 'Rue de Bruxelles 214', 'Namur', '5000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-10-17 00:00:00', '2022-10-17 00:00:00'),
('CLI086', 'Madame Lucie Fontaine', 'lucie.fontaine@telenet.be', '+32479526867', 'Rue de Namur 49', 'Gand', '9000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-03-08 00:00:00', '2024-03-08 00:00:00'),
('CLI087', 'Monsieur Romain Karimi', 'romain.karimi@outlook.com', '+32476008935', 'Place Saint-Lambert 186', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 117.39, true, '2024-09-11 00:00:00', '2024-09-11 00:00:00'),
('CLI088', 'Commerce Méditerranée', 'commerce.mediterranee@telenet.be', '+32476398528', 'Rue de Namur 117', 'Tournai', '7500', 'Belgique', 'BE932734539', 'COMPANY', 2500.00, 0.00, true, '2024-11-15 00:00:00', '2024-11-15 00:00:00'),
('CLI089', 'Pâtisserie du Centre', 'patisserie.du@skynet.be', '+32477395997', 'Rue de Stassart 234', 'Ottignies', '1340', 'Belgique', 'BE733701411', 'COMPANY', 2000.00, 0.00, true, '2022-03-01 00:00:00', '2022-03-01 00:00:00'),
('CLI090', 'Monsieur Omar Amrani', 'omar.amrani@outlook.com', '+32478665981', 'Chaussée de Charleroi 135', 'Liège', '4030', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 144.49, true, '2020-02-01 00:00:00', '2020-02-01 00:00:00'),
('CLI091', 'Traiteur Al Madina', 'traiteur.al@telenet.be', '+32476512415', 'Rue de Bruxelles 21', 'Herstal', '4040', 'Belgique', 'BE623929617', 'COMPANY', 5000.00, 134.87, true, '2024-10-11 00:00:00', '2024-10-11 00:00:00'),
('CLI092', 'Monsieur Hamza Renard', 'hamza.renard@proximus.be', '+32475821419', 'Rue des Guillemins 61', 'Arlon', '6700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 149.35, true, '2021-04-10 00:00:00', '2021-04-10 00:00:00'),
('CLI093', 'Café du Parc', 'cafe.du@yahoo.fr', '+32471941524', 'Avenue Louise 84', 'Liège', '4000', 'Belgique', 'BE707660630', 'COMPANY', 4000.00, 71.69, true, '2021-08-23 00:00:00', '2021-08-23 00:00:00'),
('CLI094', 'Monsieur Thomas Lambert', 'thomas.lambert@outlook.com', '+32477418028', 'Rue Haute 21', 'Anvers', '2000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 136.63, true, '2023-06-23 00:00:00', '2023-06-23 00:00:00'),
('CLI095', 'Monsieur Romain Dubois', 'romain.dubois@outlook.com', '+32478805654', 'Boulevard Anspach 206', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-08-12 00:00:00', '2021-08-12 00:00:00'),
('CLI096', 'Madame Zineb Simon', 'zineb.simon@skynet.be', '+32478664433', 'Rue de Stassart 65', 'Liège', '4020', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 60.42, true, '2024-09-27 00:00:00', '2024-09-27 00:00:00'),
('CLI097', 'Restaurant Le Délice', 'restaurant.le@proximus.be', '+32471368085', 'Rue de Stassart 76', 'Bruges', '8000', 'Belgique', 'BE935705734', 'COMPANY', 4000.00, 0.00, true, '2024-08-26 00:00:00', '2024-08-26 00:00:00'),
('CLI098', 'Monsieur Marc Slimani', 'marc.slimani@proximus.be', '+32475801541', 'Boulevard du Midi 128', 'Arlon', '6700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-05-07 00:00:00', '2024-05-07 00:00:00'),
('CLI099', 'Madame Houda Rachidi', 'houda.rachidi@outlook.com', '+32471661401', 'Rue de Bruxelles 25', 'Gand', '9000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-09-24 00:00:00', '2021-09-24 00:00:00'),
('CLI100', 'Superette Al Baraka', 'superette.al@outlook.com', '+32473217273', 'Rue Haute 52', 'Liège', '4020', 'Belgique', 'BE991713190', 'COMPANY', 1500.00, 0.00, true, '2024-05-29 00:00:00', '2024-05-29 00:00:00'),
('CLI101', 'Café Le Jardin', 'cafe.le@hotmail.com', '+32476682698', 'Chaussée de Wavre 76', 'Ottignies', '1340', 'Belgique', 'BE826197069', 'COMPANY', 4000.00, 0.00, true, '2024-07-05 00:00:00', '2024-07-05 00:00:00'),
('CLI102', 'Madame Wafa Tahiri', 'wafa.tahiri@outlook.com', '+32477136687', 'Rue Neuve 206', 'Herstal', '4040', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-07-03 00:00:00', '2020-07-03 00:00:00'),
('CLI103', 'Monsieur Arthur Tazi', 'arthur.tazi@skynet.be', '+32477232293', 'Avenue des Anglais 98', 'Hasselt', '3500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 134.97, true, '2020-08-09 00:00:00', '2020-08-09 00:00:00'),
('CLI104', 'Brasserie Oriental', 'brasserie.oriental@gmail.com', '+32478789116', 'Rue de Bruxelles 211', 'Charleroi', '6000', 'Belgique', 'BE426808977', 'COMPANY', 2500.00, 60.44, true, '2023-12-06 00:00:00', '2023-12-06 00:00:00'),
('CLI105', 'Commerce La Maison', 'commerce.la@hotmail.com', '+32473276065', 'Boulevard Anspach 138', 'Louvain', '3000', 'Belgique', 'BE545478870', 'COMPANY', 4000.00, 90.73, true, '2022-03-06 00:00:00', '2022-03-06 00:00:00'),
('CLI106', 'Pâtisserie du Terroir', 'patisserie.du@hotmail.com', '+32475693260', 'Rue des Mineurs 105', 'Ottignies', '1340', 'Belgique', 'BE489431174', 'COMPANY', 1000.00, 0.00, true, '2020-03-08 00:00:00', '2020-03-08 00:00:00'),
('CLI107', 'Monsieur Alexis Rachidi', 'alexis.rachidi@hotmail.com', '+32477017548', 'Rue du Commerce 231', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-05-04 00:00:00', '2020-05-04 00:00:00'),
('CLI108', 'Monsieur Baptiste Leroy', 'baptiste.leroy@hotmail.com', '+32476595355', 'Rue de la Paix 13', 'Arlon', '6700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-05-13 00:00:00', '2021-05-13 00:00:00'),
('CLI109', 'Madame Malika Moussaoui', 'malika.moussaoui@outlook.com', '+32473475548', 'Rue Léopold 199', 'Louvain', '3000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-06-03 00:00:00', '2024-06-03 00:00:00'),
('CLI110', 'Madame Fatima Dupont', 'fatima.dupont@gmail.com', '+32471432519', 'Avenue Coghen 222', 'Namur', '5000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-09-26 00:00:00', '2020-09-26 00:00:00'),
('CLI111', 'Superette Le Délice', 'superette.le@yahoo.fr', '+32472066326', 'Chaussée de Namur 30', 'Liège', '4020', 'Belgique', 'BE640992677', 'COMPANY', 1500.00, 0.00, true, '2022-09-02 00:00:00', '2022-09-02 00:00:00'),
('CLI112', 'Monsieur Nabil Muller', 'nabil.muller@proximus.be', '+32479748499', 'Boulevard du Midi 201', 'Bruxelles', '1050', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-09-09 00:00:00', '2021-09-09 00:00:00'),
('CLI113', 'Café des Artistes', 'cafe.des@proximus.be', '+32472355439', 'Rue des Guillemins 231', 'Liège', '4030', 'Belgique', 'BE728530544', 'COMPANY', 3000.00, 0.00, true, '2021-10-21 00:00:00', '2021-10-21 00:00:00'),
('CLI114', 'Monsieur Samir Tazi', 'samir.tazi@telenet.be', '+32475947563', 'Rue des Mineurs 136', 'Herstal', '4040', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 101.11, true, '2022-07-18 00:00:00', '2022-07-18 00:00:00'),
('CLI115', 'Boulangerie La Maison', 'boulangerie.la98@outlook.com', '+32477942639', 'Boulevard Anspach 59', 'Liège', '4030', 'Belgique', 'BE558234365', 'COMPANY', 2000.00, 165.48, true, '2021-11-25 00:00:00', '2021-11-25 00:00:00'),
('CLI116', 'Monsieur Florian Hajji', 'florian.hajji@proximus.be', '+32478956894', 'Boulevard d''Avroy 176', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-05-17 00:00:00', '2020-05-17 00:00:00'),
('CLI117', 'Kebab House Le Croissant', 'kebabhouse.le@telenet.be', '+32476530541', 'Rue du Commerce 16', 'Gand', '9000', 'Belgique', 'BE554124989', 'COMPANY', 5000.00, 0.00, true, '2023-10-04 00:00:00', '2023-10-04 00:00:00'),
('CLI118', 'Monsieur Nabil Moreau', 'nabil.moreau@gmail.com', '+32476242022', 'Place Saint-Lambert 154', 'Bruxelles', '1050', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-12-21 00:00:00', '2021-12-21 00:00:00'),
('CLI119', 'Kebab House Chez Momo', 'kebabhouse.chez@telenet.be', '+32475673599', 'Boulevard de la Sauvenière 30', 'Tournai', '7500', 'Belgique', 'BE978779150', 'COMPANY', 3000.00, 45.23, true, '2023-03-21 00:00:00', '2023-03-21 00:00:00'),
('CLI120', 'Madame Hafsa Boutari', 'hafsa.boutari@telenet.be', '+32475487028', 'Rue de la Paix 156', 'Tournai', '7500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-02-29 00:00:00', '2020-02-29 00:00:00'),
('CLI121', 'Boulangerie Anatolie', 'boulangerie.anatolie@outlook.com', '+32471514340', 'Rue des Guillemins 37', 'Herstal', '4040', 'Belgique', 'BE269016920', 'COMPANY', 2000.00, 0.00, true, '2020-07-06 00:00:00', '2020-07-06 00:00:00'),
('CLI122', 'Fast Food La Bonne Table', 'fastfood.la@proximus.be', '+32472425342', 'Rue Verte 242', 'Verviers', '4800', 'Belgique', 'BE187597497', 'COMPANY', 2000.00, 0.00, true, '2024-12-14 00:00:00', '2024-12-14 00:00:00'),
('CLI123', 'Traiteur Anatolie', 'traiteur.anatolie@outlook.com', '+32478416270', 'Rue de Liège 156', 'Liège', '4020', 'Belgique', 'BE828230915', 'COMPANY', 4000.00, 0.00, true, '2022-04-28 00:00:00', '2022-04-28 00:00:00'),
('CLI124', 'Monsieur Nicolas David', 'nicolas.david@hotmail.com', '+32471761976', 'Avenue Coghen 79', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-03-27 00:00:00', '2021-03-27 00:00:00'),
('CLI125', 'Monsieur Bilal Vincent', 'bilal.vincent@proximus.be', '+32473013003', 'Place Saint-Lambert 84', 'Hasselt', '3500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 99.48, true, '2020-01-16 00:00:00', '2020-01-16 00:00:00'),
('CLI126', 'Boulangerie Le Soleil', 'boulangerie.le@gmail.com', '+32476941939', 'Avenue de Tervueren 172', 'Tournai', '7500', 'Belgique', 'BE436146289', 'COMPANY', 3000.00, 0.00, true, '2020-05-27 00:00:00', '2020-05-27 00:00:00'),
('CLI127', 'Traiteur du Port', 'traiteur.du@skynet.be', '+32478007741', 'Rue de Stassart 164', 'Herstal', '4040', 'Belgique', 'BE594025283', 'COMPANY', 5000.00, 0.00, true, '2021-08-15 00:00:00', '2021-08-15 00:00:00'),
('CLI128', 'Monsieur Kevin David', 'kevin.david@outlook.com', '+32472776088', 'Rue des Guillemins 112', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 87.14, true, '2021-05-13 00:00:00', '2021-05-13 00:00:00'),
('CLI129', 'Traiteur La Maison', 'traiteur.la@telenet.be', '+32472913049', 'Rue des Guillemins 131', 'Anvers', '2000', 'Belgique', 'BE793039113', 'COMPANY', 5000.00, 0.00, true, '2022-12-22 00:00:00', '2022-12-22 00:00:00'),
('CLI130', 'Café Le Jardin', 'cafe.le@yahoo.fr', '+32474309671', 'Boulevard d''Avroy 66', 'Namur', '5000', 'Belgique', 'BE598165815', 'COMPANY', 5000.00, 0.00, true, '2020-12-21 00:00:00', '2020-12-21 00:00:00'),
('CLI131', 'Monsieur Romain Ziani', 'romain.ziani@yahoo.fr', '+32476422534', 'Rue Grétry 175', 'Mouscron', '7700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-11-04 00:00:00', '2024-11-04 00:00:00'),
('CLI132', 'Madame Nadia Benali', 'nadia.benali@telenet.be', '+32476904610', 'Avenue des Anglais 15', 'Hasselt', '3500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 14.84, true, '2022-11-05 00:00:00', '2022-11-05 00:00:00'),
('CLI133', 'Pâtisserie L''Étoile', 'patisserie.letoile@proximus.be', '+32479507186', 'Rue des Mineurs 153', 'Charleroi', '6000', 'Belgique', 'BE302120588', 'COMPANY', 2000.00, 0.00, true, '2022-02-26 00:00:00', '2022-02-26 00:00:00'),
('CLI134', 'Monsieur Sofiane Dupont', 'sofiane.dupont@hotmail.com', '+32472038068', 'Boulevard d''Avroy 246', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-07-11 00:00:00', '2022-07-11 00:00:00'),
('CLI135', 'Madame Lucie Fontaine', 'lucie.fontaine@skynet.be', '+32473663319', 'Chaussée de Namur 134', 'Liège', '4030', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-01-15 00:00:00', '2022-01-15 00:00:00'),
('CLI136', 'Snack La Maison', 'snack.la@proximus.be', '+32472585546', 'Rue des Guillemins 85', 'Verviers', '4800', 'Belgique', 'BE747145068', 'COMPANY', 5000.00, 0.00, true, '2023-02-16 00:00:00', '2023-02-16 00:00:00'),
('CLI137', 'Café La Bonne Table', 'cafe.la@gmail.com', '+32473372774', 'Avenue des Anglais 170', 'Charleroi', '6000', 'Belgique', 'BE432411019', 'COMPANY', 3000.00, 62.05, true, '2021-12-17 00:00:00', '2021-12-17 00:00:00'),
('CLI138', 'Superette du Nord', 'superette.du@outlook.com', '+32479831414', 'Avenue de Tervueren 33', 'Verviers', '4800', 'Belgique', 'BE431642423', 'COMPANY', 1500.00, 129.20, true, '2020-07-10 00:00:00', '2020-07-10 00:00:00'),
('CLI139', 'Monsieur Julien Hajji', 'julien.hajji@telenet.be', '+32474221313', 'Rue Verte 125', 'Verviers', '4800', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-04-08 00:00:00', '2021-04-08 00:00:00'),
('CLI140', 'Madame Malika Martin', 'malika.martin@telenet.be', '+32476649968', 'Avenue Louise 170', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-11-29 00:00:00', '2024-11-29 00:00:00'),
('CLI141', 'Madame Aurélie Renard', 'aurelie.renard@outlook.com', '+32473777286', 'Chaussée de Wavre 232', 'Arlon', '6700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 87.53, true, '2024-01-16 00:00:00', '2024-01-16 00:00:00'),
('CLI142', 'Monsieur Hassan Fennani', 'hassan.fennani@yahoo.fr', '+32475012581', 'Avenue de la Reine 137', 'Liège', '4030', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 193.12, true, '2021-09-25 00:00:00', '2021-09-25 00:00:00'),
('CLI143', 'Madame Samira Amrani', 'samira.amrani@outlook.com', '+32478023963', 'Chaussée de Namur 136', 'Herstal', '4040', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-11-27 00:00:00', '2020-11-27 00:00:00'),
('CLI144', 'Monsieur Antoine Renard', 'antoine.renard@skynet.be', '+32479655523', 'Rue de Stassart 217', 'Namur', '5000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-10-09 00:00:00', '2024-10-09 00:00:00'),
('CLI145', 'Friterie Le Soleil', 'friterie.le@gmail.com', '+32474725179', 'Rue des Guillemins 243', 'Liège', '4020', 'Belgique', 'BE525689202', 'COMPANY', 3000.00, 0.00, true, '2024-07-30 00:00:00', '2024-07-30 00:00:00'),
('CLI146', 'Kebab House Du Bonheur', 'kebabhouse.du@outlook.com', '+32474767135', 'Rue des Guillemins 96', 'Herstal', '4040', 'Belgique', 'BE949738493', 'COMPANY', 1500.00, 0.00, true, '2020-02-27 00:00:00', '2020-02-27 00:00:00'),
('CLI147', 'Pâtisserie La Bonne Table', 'patisserie.la@gmail.com', '+32478926478', 'Rue du Fossé aux Loups 213', 'Bruges', '8000', 'Belgique', 'BE120405269', 'COMPANY', 2000.00, 166.22, true, '2023-11-26 00:00:00', '2023-11-26 00:00:00'),
('CLI148', 'Épicerie de la Gare', 'epicerie.de@gmail.com', '+32479854536', 'Rue du Commerce 241', 'Gand', '9000', 'Belgique', 'BE356022467', 'COMPANY', 2500.00, 0.00, true, '2022-05-16 00:00:00', '2022-05-16 00:00:00'),
('CLI149', 'Monsieur Zakaria Garcia', 'zakaria.garcia@gmail.com', '+32472859886', 'Rue Grétry 17', 'Arlon', '6700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-09-09 00:00:00', '2024-09-09 00:00:00'),
('CLI150', 'Monsieur Tarek Karimi', 'tarek.karimi@telenet.be', '+32474142605', 'Avenue des Anglais 107', 'Louvain', '3000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-09-22 00:00:00', '2023-09-22 00:00:00'),
('CLI151', 'Madame Fatima Dubois', 'fatima.dubois@gmail.com', '+32478887557', 'Rue de la Paix 100', 'Tournai', '7500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-03-30 00:00:00', '2020-03-30 00:00:00'),
('CLI152', 'Kebab House Al Madina', 'kebabhouse.al@telenet.be', '+32476578736', 'Rue Verte 149', 'Namur', '5000', 'Belgique', 'BE936597989', 'COMPANY', 4000.00, 0.00, true, '2020-09-30 00:00:00', '2020-09-30 00:00:00'),
('CLI153', 'Monsieur Julien Bernard', 'julien.bernard@telenet.be', '+32473262450', 'Rue de Bruxelles 47', 'Ottignies', '1340', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 143.21, true, '2020-05-09 00:00:00', '2020-05-09 00:00:00'),
('CLI154', 'Snack du Centre', 'snack.du@proximus.be', '+32476202210', 'Rue Léopold 239', 'Bruxelles', '1050', 'Belgique', 'BE305195749', 'COMPANY', 2000.00, 79.64, true, '2022-11-21 00:00:00', '2022-11-21 00:00:00'),
('CLI155', 'Boulangerie Méditerranée', 'boulangerie.mediterranee@yahoo.fr', '+32476568772', 'Rue Neuve 168', 'Bruxelles', '1050', 'Belgique', 'BE515156661', 'COMPANY', 2000.00, 0.00, true, '2021-07-13 00:00:00', '2021-07-13 00:00:00'),
('CLI156', 'Madame Yasmine Adam', 'yasmine.adam@telenet.be', '+32477163058', 'Rue de Stassart 128', 'Ottignies', '1340', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-06-20 00:00:00', '2024-06-20 00:00:00'),
('CLI157', 'Pâtisserie La Bonne Table', 'patisserie.la@yahoo.fr', '+32472343333', 'Rue Léopold 27', 'Bruges', '8000', 'Belgique', 'BE278933456', 'COMPANY', 4000.00, 0.00, true, '2021-11-02 00:00:00', '2021-11-02 00:00:00'),
('CLI158', 'Alimentation L''Étoile', 'alimentation.letoile@gmail.com', '+32476914963', 'Avenue Louise 187', 'Liège', '4030', 'Belgique', 'BE180574838', 'COMPANY', 4000.00, 0.00, true, '2023-06-13 00:00:00', '2023-06-13 00:00:00'),
('CLI159', 'Monsieur Bilal Ziani', 'bilal.ziani@telenet.be', '+32473684131', 'Chaussée de Namur 206', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 28.56, true, '2020-03-04 00:00:00', '2020-03-04 00:00:00'),
('CLI160', 'Madame Meryem Renard', 'meryem.renard@gmail.com', '+32471543335', 'Rue de Namur 244', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 30.69, true, '2023-05-24 00:00:00', '2023-05-24 00:00:00'),
('CLI161', 'Monsieur Pierre Ouali', 'pierre.ouali@yahoo.fr', '+32476274512', 'Boulevard de la Sauvenière 102', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-08-23 00:00:00', '2023-08-23 00:00:00'),
('CLI162', 'Madame Isabelle Tahiri', 'isabelle.tahiri@telenet.be', '+32475366937', 'Rue du Marché 199', 'Namur', '5000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-12-12 00:00:00', '2023-12-12 00:00:00'),
('CLI163', 'Alimentation du Nord', 'alimentation.du@gmail.com', '+32478467726', 'Boulevard Anspach 183', 'Anvers', '2000', 'Belgique', 'BE690554938', 'COMPANY', 3000.00, 0.00, true, '2020-06-28 00:00:00', '2020-06-28 00:00:00'),
('CLI164', 'Brasserie Maghreb', 'brasserie.maghreb@hotmail.com', '+32473920762', 'Rue Neuve 41', 'Bruges', '8000', 'Belgique', 'BE354193540', 'COMPANY', 5000.00, 0.00, true, '2024-06-13 00:00:00', '2024-06-13 00:00:00'),
('CLI165', 'Monsieur Omar David', 'omar.david@proximus.be', '+32477189302', 'Rue du Commerce 147', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-08-15 00:00:00', '2022-08-15 00:00:00'),
('CLI166', 'Madame Leila Renard', 'leila.renard@proximus.be', '+32477869154', 'Avenue Blonden 197', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-08-13 00:00:00', '2024-08-13 00:00:00'),
('CLI167', 'Monsieur Samir Belmahi', 'samir.belmahi@outlook.com', '+32474052834', 'Boulevard Anspach 213', 'Gand', '9000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 193.25, true, '2024-04-21 00:00:00', '2024-04-21 00:00:00'),
('CLI168', 'Kebab House de la Place', 'kebabhouse.de@hotmail.com', '+32474782763', 'Rue du Fossé aux Loups 182', 'Verviers', '4800', 'Belgique', 'BE781887358', 'COMPANY', 3000.00, 0.00, true, '2021-12-09 00:00:00', '2021-12-09 00:00:00'),
('CLI169', 'Café Le Croissant', 'cafe.le@proximus.be', '+32472567468', 'Rue des Mineurs 137', 'Bruges', '8000', 'Belgique', 'BE749762955', 'COMPANY', 2000.00, 0.00, true, '2022-10-26 00:00:00', '2022-10-26 00:00:00'),
('CLI170', 'Monsieur Quentin Petit', 'quentin.petit@proximus.be', '+32471476028', 'Avenue Louise 212', 'Mouscron', '7700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-06-15 00:00:00', '2020-06-15 00:00:00'),
('CLI171', 'Snack du Terroir', 'snack.du75@proximus.be', '+32476068298', 'Place Saint-Lambert 165', 'Tournai', '7500', 'Belgique', 'BE164331134', 'COMPANY', 1500.00, 48.98, true, '2022-09-16 00:00:00', '2022-09-16 00:00:00'),
('CLI172', 'Grocery Le Palmier', 'grocery.le@yahoo.fr', '+32476707484', 'Rue Grétry 53', 'Ottignies', '1340', 'Belgique', 'BE240409084', 'COMPANY', 5000.00, 0.00, true, '2023-05-27 00:00:00', '2023-05-27 00:00:00'),
('CLI173', 'Épicerie Oriental', 'epicerie.oriental@gmail.com', '+32475055688', 'Chaussée de Charleroi 82', 'Tournai', '7500', 'Belgique', 'BE411612760', 'COMPANY', 2500.00, 24.50, true, '2022-08-13 00:00:00', '2022-08-13 00:00:00'),
('CLI174', 'Monsieur Jean Ouali', 'jean.ouali@yahoo.fr', '+32473679315', 'Avenue de la Reine 247', 'Liège', '4020', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-07-24 00:00:00', '2024-07-24 00:00:00'),
('CLI175', 'Monsieur Mathieu Dubois', 'mathieu.dubois@gmail.com', '+32472510773', 'Rue de Liège 6', 'Bruges', '8000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-03-16 00:00:00', '2022-03-16 00:00:00'),
('CLI176', 'Boulangerie Oriental', 'boulangerie.oriental@outlook.com', '+32478895137', 'Boulevard Anspach 216', 'Arlon', '6700', 'Belgique', 'BE881155839', 'COMPANY', 2000.00, 0.00, true, '2021-08-08 00:00:00', '2021-08-08 00:00:00'),
('CLI177', 'Madame Leila Vincent', 'leila.vincent@yahoo.fr', '+32471858283', 'Avenue Louise 103', 'Seraing', '4100', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-03-13 00:00:00', '2023-03-13 00:00:00'),
('CLI178', 'Madame Rim Tazi', 'rim.tazi@outlook.com', '+32472993318', 'Avenue de Tervueren 160', 'Hasselt', '3500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 195.02, true, '2020-09-20 00:00:00', '2020-09-20 00:00:00'),
('CLI179', 'Monsieur Ibrahim Amrani', 'ibrahim.amrani@yahoo.fr', '+32477734157', 'Rue des Mineurs 131', 'Mons', '7000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-10-21 00:00:00', '2022-10-21 00:00:00'),
('CLI180', 'Commerce du Midi', 'commerce.du@telenet.be', '+32476344047', 'Boulevard d''Avroy 84', 'Wavre', '1300', 'Belgique', 'BE647301347', 'COMPANY', 3000.00, 0.00, true, '2020-11-28 00:00:00', '2020-11-28 00:00:00'),
('CLI181', 'Madame Emma David', 'emma.david@proximus.be', '+32471279121', 'Place Saint-Lambert 122', 'Mouscron', '7700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2022-01-24 00:00:00', '2022-01-24 00:00:00'),
('CLI182', 'Monsieur Mathieu Amrani', 'mathieu.amrani@skynet.be', '+32475454861', 'Rue des Mineurs 122', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-09-04 00:00:00', '2023-09-04 00:00:00'),
('CLI183', 'Monsieur Quentin Tahiri', 'quentin.tahiri@gmail.com', '+32477378535', 'Rue Verte 216', 'Arlon', '6700', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-10-29 00:00:00', '2020-10-29 00:00:00'),
('CLI184', 'Kebab House Le Palmier', 'kebabhouse.le@proximus.be', '+32474420734', 'Boulevard d''Avroy 106', 'Liège', '4020', 'Belgique', 'BE166874023', 'COMPANY', 4000.00, 100.36, true, '2022-04-20 00:00:00', '2022-04-20 00:00:00'),
('CLI185', 'Pâtisserie Chez Momo', 'patisserie.chez@skynet.be', '+32479025733', 'Rue du Commerce 84', 'Mons', '7000', 'Belgique', 'BE480412754', 'COMPANY', 4000.00, 0.00, true, '2022-12-12 00:00:00', '2022-12-12 00:00:00'),
('CLI186', 'Monsieur Sébastien Garcia', 'sebastien.garcia@hotmail.com', '+32474225657', 'Rue des Mineurs 124', 'Hasselt', '3500', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-05-19 00:00:00', '2021-05-19 00:00:00'),
('CLI187', 'Madame Khadija Fennani', 'khadija.fennani@skynet.be', '+32476851946', 'Rue Léopold 123', 'Ottignies', '1340', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-02-21 00:00:00', '2023-02-21 00:00:00'),
('CLI188', 'Traiteur du Terroir', 'traiteur.du@outlook.com', '+32473457461', 'Avenue de Tervueren 89', 'Herstal', '4040', 'Belgique', 'BE902448600', 'COMPANY', 2500.00, 0.00, true, '2021-08-17 00:00:00', '2021-08-17 00:00:00'),
('CLI189', 'Épicerie du Centre', 'epicerie.du@skynet.be', '+32475557052', 'Rue du Marché 239', 'Tournai', '7500', 'Belgique', 'BE342313086', 'COMPANY', 4000.00, 0.00, true, '2020-10-08 00:00:00', '2020-10-08 00:00:00'),
('CLI190', 'Restaurant Chez Momo', 'restaurant.chez@hotmail.com', '+32478925622', 'Avenue Blonden 85', 'Namur', '5000', 'Belgique', 'BE536913550', 'COMPANY', 4000.00, 0.00, true, '2020-07-24 00:00:00', '2020-07-24 00:00:00'),
('CLI191', 'Madame Samira Rachidi', 'samira.rachidi@skynet.be', '+32474346315', 'Rue de Liège 167', 'Ottignies', '1340', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2024-03-28 00:00:00', '2024-03-28 00:00:00'),
('CLI192', 'Friterie du Centre', 'friterie.du@yahoo.fr', '+32473937099', 'Rue du Fossé aux Loups 236', 'Bruxelles', '1050', 'Belgique', 'BE946066287', 'COMPANY', 2500.00, 0.00, true, '2022-05-05 00:00:00', '2022-05-05 00:00:00'),
('CLI193', 'Friterie du Midi', 'friterie.du292@yahoo.fr', '+32471155477', 'Boulevard Anspach 10', 'Bruges', '8000', 'Belgique', 'BE788603957', 'COMPANY', 3000.00, 0.00, true, '2021-09-03 00:00:00', '2021-09-03 00:00:00'),
('CLI194', 'Madame Marie Lambert', 'marie.lambert@outlook.com', '+32478852085', 'Rue Neuve 130', 'Gand', '9000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2021-07-12 00:00:00', '2021-07-12 00:00:00'),
('CLI195', 'Monsieur Arthur Muller', 'arthur.muller@yahoo.fr', '+32475949685', 'Boulevard du Midi 87', 'Liège', '4000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2023-03-08 00:00:00', '2023-03-08 00:00:00'),
('CLI196', 'Madame Aurélie Boutari', 'aurelie.boutari@yahoo.fr', '+32472600296', 'Rue de Namur 172', 'Charleroi', '6000', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 196.34, true, '2021-01-13 00:00:00', '2021-01-13 00:00:00'),
('CLI197', 'Restaurant Le Croissant', 'restaurant.le@yahoo.fr', '+32471191859', 'Rue Léopold 78', 'Hasselt', '3500', 'Belgique', 'BE429430802', 'COMPANY', 1500.00, 0.00, true, '2021-06-19 00:00:00', '2021-06-19 00:00:00'),
('CLI198', 'Traiteur La Bonne Table', 'traiteur.la@hotmail.com', '+32476217344', 'Rue du Fossé aux Loups 230', 'Wavre', '1300', 'Belgique', 'BE243418388', 'COMPANY', 2500.00, 0.00, true, '2023-11-14 00:00:00', '2023-11-14 00:00:00'),
('CLI199', 'Fast Food du Parc', 'fastfood.du@telenet.be', '+32478899184', 'Boulevard de la Sauvenière 107', 'Arlon', '6700', 'Belgique', 'BE739750911', 'COMPANY', 5000.00, 0.00, true, '2024-03-31 00:00:00', '2024-03-31 00:00:00'),
('CLI200', 'Monsieur Baptiste Chaoui', 'baptiste.chaoui@skynet.be', '+32477069742', 'Rue Grétry 136', 'Wavre', '1300', 'Belgique', NULL, 'INDIVIDUAL', 500.00, 0.00, true, '2020-06-08 00:00:00', '2020-06-08 00:00:00');

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
INSERT INTO stock_movements (product_id, movement_type , quantity, reason, reference_document, created_at) VALUES
(1,  'IN', 150, 'Stock initial', 'INIT-001', NOW()),
(2,  'IN', 200, 'Stock initial', 'INIT-001', NOW()),
(3,  'IN', 80,  'Stock initial', 'INIT-001', NOW()),
(4,  'IN', 300, 'Stock initial', 'INIT-001', NOW()),
(5,  'IN', 120, 'Stock initial', 'INIT-001', NOW()),
(11, 'IN', 100, 'Stock initial', 'INIT-002', NOW()),
(12, 'IN', 180, 'Stock initial', 'INIT-002', NOW()),
(13, 'IN', 90,  'Stock initial', 'INIT-002', NOW()),
(17, 'IN', 250, 'Stock initial', 'INIT-003', NOW()),
(18, 'IN', 230, 'Stock initial', 'INIT-003', NOW()),
(19, 'IN', 100, 'Stock initial', 'INIT-003', NOW()),
(36, 'IN', 40,  'Stock initial', 'INIT-004', NOW()),
(37, 'IN', 50,  'Stock initial', 'INIT-004', NOW());

-- ========================================
-- ACCORDS DE PRIX SPÉCIAUX
-- ========================================
INSERT INTO customer_price_agreements (customer_id, product_id, special_price, valid_from, valid_until, created_at, updated_at) VALUES
(1, 1, 2.49, '2026-01-01', '2026-12-31', NOW(), NOW()),
(1, 2, 1.59, '2026-01-01', '2026-12-31', NOW(), NOW()),
(1, 3, 6.95, '2026-01-01', '2026-12-31', NOW(), NOW()),
(2, 4, 1.09, '2026-01-01', '2026-06-30', NOW(), NOW()),
(2, 17, 1.69, '2026-01-01', '2026-06-30', NOW(), NOW()),
(4, 36, 8.99, '2026-01-01', '2026-12-31', NOW(), NOW());

-- ========================================
-- DOCUMENTS DE VENTE
-- ========================================
INSERT INTO sale_documents (document_number, type, customer_id, document_date, due_date, total_amount, notes, status, created_at, updated_at) VALUES
('INV20260228-0001', 'INVOICE', 1, '2026-02-28', '2026-03-30', 0.00, 'Livraison hebdomadaire', 'SENT',  NOW(), NOW()),
('QUO20260228-0001', 'QUOTE',   2, '2026-02-28', '2026-03-15', 0.00, 'Commande mensuelle',    'DRAFT', NOW(), NOW()),
('INV20260228-0002', 'INVOICE', 3, '2026-02-28', '2026-02-28', 0.00, 'Paiement comptant',     'PAID',  NOW(), NOW());

INSERT INTO sale_document_lines (sale_document_id, product_id, quantity, unit_price, discount_percent, line_total) VALUES
(1, 1,  20, 2.49, 0.00, 49.80),
(1, 2,  15, 1.59, 0.00, 23.85),
(1, 3,   5, 6.95, 0.00, 34.75),
(1, 6,  10, 2.15, 0.00, 21.50),
(2, 4,  50, 1.09, 0.00, 54.50),
(2, 17, 30, 1.69, 0.00, 50.70),
(2, 11, 20, 5.95, 0.00, 119.00),
(2, 12, 25, 2.49, 0.00, 62.25),
(3, 36,  1, 9.99, 0.00, 9.99),
(3, 15,  2, 4.50, 0.00, 9.00),
(3, 21,  1, 2.49, 0.00, 2.49);

UPDATE sale_documents SET total_amount = 129.90  WHERE id = 1;
UPDATE sale_documents SET total_amount = 286.45  WHERE id = 2;
UPDATE sale_documents SET total_amount = 21.48   WHERE id = 3;

-- ========================================
-- PAIEMENTS
-- ========================================
INSERT INTO payments (payment_number, payment_type, amount, payment_date, customer_id, reference, notes, validated, created_at, updated_at) VALUES
('PAY20260228-0001', 'BANK_TRANSFER', 129.90, '2026-02-28', 1, 'INV20260228-0001', 'Virement reçu',              true, NOW(), NOW()),
('PAY20260228-0002', 'CASH',           21.48, '2026-02-28', 3, 'INV20260228-0002', 'Paiement comptant en magasin', true, NOW(), NOW());

-- ========================================
-- DOCUMENTS D'ACHAT
-- ========================================
INSERT INTO purchase_documents (document_number, type, supplier_id, document_date, due_date, total_amount, notes, status, stock_updated, created_at, updated_at) VALUES
('PO20260225-0001',  'ORDER',   1, '2026-02-25', '2026-03-10', 0.00, 'Commande mensuelle',         'SENT',     false, NOW(), NOW()),
('REC20260226-0001', 'RECEIPT', 2, '2026-02-26', '2026-04-10', 0.00, 'Livraison produits orientaux', 'RECEIVED', true,  NOW(), NOW());

INSERT INTO purchase_document_lines (purchase_document_id, product_id, quantity, unit_price, line_total) VALUES
(1, 4,  100, 0.95, 95.00),
(1, 17,  50, 1.45, 72.50),
(1, 11,  30, 4.50, 135.00),
(2, 1,   50, 2.20, 110.00),
(2, 2,  100, 1.40, 140.00),
(2, 36,  20, 7.50, 150.00),
(2, 37,  25, 4.80, 120.00);

UPDATE purchase_documents SET total_amount = 302.50 WHERE id = 1;
UPDATE purchase_documents SET total_amount = 520.00 WHERE id = 2;

-- ========================================
-- COMPTES FINANCIERS
-- ========================================
INSERT INTO financial_accounts (account_number, account_name, account_type, balance, currency, description, active, created_at, updated_at) VALUES
('BE68539007547034', 'Compte Courant Principal', 'BANK',    15000.00, 'EUR', 'Compte bancaire BNP Paribas Fortis', true, NOW(), NOW()),
('CAISSE-001',       'Caisse Magasin',           'CASH',     2500.00, 'EUR', 'Caisse enregistreuse principale',    true, NOW(), NOW()),
('EPARGNE-001',      'Compte Épargne',           'SAVINGS',  8000.00, 'EUR', 'Réserve financière',                 true, NOW(), NOW());

-- ========================================
-- TRANSACTIONS FINANCIÈRES
-- ========================================
INSERT INTO financial_transactions (transaction_number, account_id, created_by_user_id, validated_by_user_id, transaction_type, amount, transaction_date, description, reference, category, applied, notes, created_at, updated_at) VALUES
('TXN20260228-000001', 1, 3, 2, 'CREDIT', 129.90, '2026-02-28', 'Paiement Restaurant Le Méditerranée', 'PAY20260228-0001', 'VENTE',    true, 'Virement bancaire',         NOW(), NOW()),
('TXN20260228-000002', 2, 3, 3, 'CREDIT',  21.48, '2026-02-28', 'Vente Mme Boutari',                   'PAY20260228-0002', 'VENTE',    true, 'Paiement comptant',         NOW(), NOW()),
('TXN20260227-000001', 1, 2, 2, 'DEBIT',  302.50, '2026-02-27', 'Paiement fournisseur Metro',          'PO20260225-0001',  'ACHAT',    true, 'Virement vers Metro',       NOW(), NOW()),
('TXN20260226-000001', 1, 2, 1, 'DEBIT',  520.00, '2026-02-26', 'Paiement Importation Orientale',      'REC20260226-0001', 'ACHAT',    true, 'Virement 45 jours',         NOW(), NOW()),
('TXN20260228-000003', 1, 2, 2, 'DEBIT',  500.00, '2026-02-28', 'Approvisionnement caisse',            'TRANSFER-001',     'INTERNAL', true, 'Transfert vers caisse',     NOW(), NOW()),
('TXN20260228-000004', 2, 2, 2, 'CREDIT', 500.00, '2026-02-28', 'Approvisionnement caisse',            'TRANSFER-001',     'INTERNAL', true, 'Transfert depuis compte',   NOW(), NOW());

-- ========================================
-- MISE À JOUR DES SOLDES FINAUX
-- 15000 + 129.90 - 302.50 - 520.00 - 500.00 = 13807.40
-- 2500  + 21.48  + 500.00                    = 3021.48
-- ========================================
UPDATE financial_accounts SET balance = 13807.40 WHERE id = 1;
UPDATE financial_accounts SET balance = 3021.48  WHERE id = 2;

-- ========================================
-- VÉRIFICATION DES DONNÉES INSÉRÉES
-- ========================================
SELECT 'Utilisateurs'            AS table_name, COUNT(*) AS nombre FROM users
UNION ALL SELECT 'Catégories',              COUNT(*) FROM categories
UNION ALL SELECT 'Produits',               COUNT(*) FROM products
UNION ALL SELECT 'Clients',                COUNT(*) FROM customers
UNION ALL SELECT 'Fournisseurs',           COUNT(*) FROM suppliers
UNION ALL SELECT 'Mouvements Stock',       COUNT(*) FROM stock_movements
UNION ALL SELECT 'Accords Prix',           COUNT(*) FROM customer_price_agreements
UNION ALL SELECT 'Documents Vente',        COUNT(*) FROM sale_documents
UNION ALL SELECT 'Lignes Vente',           COUNT(*) FROM sale_document_lines
UNION ALL SELECT 'Documents Achat',        COUNT(*) FROM purchase_documents
UNION ALL SELECT 'Lignes Achat',           COUNT(*) FROM purchase_document_lines
UNION ALL SELECT 'Paiements',              COUNT(*) FROM payments
UNION ALL SELECT 'Comptes Financiers',     COUNT(*) FROM financial_accounts
UNION ALL SELECT 'Transactions Financières', COUNT(*) FROM financial_transactions;