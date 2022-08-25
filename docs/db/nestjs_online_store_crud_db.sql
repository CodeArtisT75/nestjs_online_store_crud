-- ----------------------------
-- Type structure for user_role_enum
-- ----------------------------
DROP TYPE IF EXISTS "public"."user_role_enum";
CREATE TYPE "public"."user_role_enum" AS ENUM (
  'admin',
  'customer'
);
ALTER TYPE "public"."user_role_enum" OWNER TO "postgres";

-- ----------------------------
-- Type structure for users_role_enum
-- ----------------------------
DROP TYPE IF EXISTS "public"."users_role_enum";
CREATE TYPE "public"."users_role_enum" AS ENUM (
  'admin',
  'customer'
);
ALTER TYPE "public"."users_role_enum" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for products_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."products_id_seq";
CREATE SEQUENCE "public"."products_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for shopping_carts_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."shopping_carts_id_seq";
CREATE SEQUENCE "public"."shopping_carts_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS "public"."products";
CREATE TABLE "public"."products" (
  "id" int4 NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  "name" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "description" varchar COLLATE "pg_catalog"."default",
  "quantity" int4 NOT NULL DEFAULT 0,
  "price" numeric NOT NULL DEFAULT '0'::numeric,
  "created_at" timestamp(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
  "updated_at" timestamp(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone
)
;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO "public"."products" VALUES (8, 'Rice', 'Lovely Rice', 20, 500.00, '2022-08-26 01:15:01.991888', '2022-08-26 01:15:01.991888');
INSERT INTO "public"."products" VALUES (9, 'Burger', 'Lovely Burger', 20, 500.00, '2022-08-26 01:15:03.908167', '2022-08-26 01:15:03.908167');
INSERT INTO "public"."products" VALUES (4, 'Cake', 'Lovely Cake', 20, 500.00, '2022-08-25 19:21:52.852919', '2022-08-25 19:21:52.852919');
INSERT INTO "public"."products" VALUES (5, 'Pizza', 'Lovely  Pizza', 20, 500.00, '2022-08-26 01:14:55.785267', '2022-08-26 01:14:55.785267');
INSERT INTO "public"."products" VALUES (6, 'Soup', 'Lovely Soup', 20, 500.00, '2022-08-26 01:14:58.055934', '2022-08-26 01:14:58.055934');
INSERT INTO "public"."products" VALUES (7, 'Salad', 'Lovely Salad', 20, 500.00, '2022-08-26 01:15:00.255136', '2022-08-26 01:15:00.255136');

-- ----------------------------
-- Table structure for shopping_carts
-- ----------------------------
DROP TABLE IF EXISTS "public"."shopping_carts";
CREATE TABLE "public"."shopping_carts" (
  "id" int4 NOT NULL DEFAULT nextval('shopping_carts_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "product_id" int4 NOT NULL,
  "count" int4 NOT NULL DEFAULT 0,
  "created_at" timestamp(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone
)
;

-- ----------------------------
-- Records of shopping_carts
-- ----------------------------
INSERT INTO "public"."shopping_carts" VALUES (3, 1, 4, 4, '2022-08-25 19:22:33.510661');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "username" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer'::users_role_enum,
  "created_at" timestamp(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
  "updated_at" timestamp(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES (4, 'samuel', '$2b$10$YFZ55a1q9FmeA9MHY8B86ugIfk0PP6aVjs7Y3WaxZ920YVKNMMgxS', 'Samuel', 'customer', '2022-08-26 01:12:34.600505', '2022-08-26 01:12:34.600505');
INSERT INTO "public"."users" VALUES (3, 'moe', '$2b$10$zT2k7yz5j94MATuRmTTVeeFbuLEIBlto7vlmjNvOWKebJWngTkvP.', 'Moe', 'customer', '2022-08-26 01:12:26.052863', '2022-08-26 01:12:26.052863');
INSERT INTO "public"."users" VALUES (5, 'david', '$2b$10$H.CrOKHKCIuJ8wQr5eIDGerD.96SQX8an3irxmxF1aiRHGyRN7MJm', 'David', 'customer', '2022-08-26 01:12:37.367134', '2022-08-26 01:12:37.367134');
INSERT INTO "public"."users" VALUES (6, 'stanlee', '$2b$10$LQGOakSuknFpJ4/.BoFWDObfZl8VLZmDTqJW7QxFa8tvg6YkKJ7Rq', 'Stan', 'customer', '2022-08-26 01:12:42.231101', '2022-08-26 01:12:42.231101');
INSERT INTO "public"."users" VALUES (1, 'mike', '$2b$10$DPrp7z8N1NPBVcC6c9X.7eK5X7FP0aNAqNWv11kuTFW24zSCtDNjK', 'Mike', 'customer', '2022-08-25 17:01:43.669396', '2022-08-26 00:12:32.233535');

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."products_id_seq"
OWNED BY "public"."products"."id";
SELECT setval('"public"."products_id_seq"', 9, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."shopping_carts_id_seq"
OWNED BY "public"."shopping_carts"."id";
SELECT setval('"public"."shopping_carts_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 7, true);

-- ----------------------------
-- Primary Key structure for table products
-- ----------------------------
ALTER TABLE "public"."products" ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table shopping_carts
-- ----------------------------
ALTER TABLE "public"."shopping_carts" ADD CONSTRAINT "PK_7420877774b880a61269dda7e8a" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table shopping_carts
-- ----------------------------
ALTER TABLE "public"."shopping_carts" ADD CONSTRAINT "FK_7d5a425bf2a31aa1002a041ebb6" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."shopping_carts" ADD CONSTRAINT "FK_92a2fdbe0a68f018ed35b5505fd" FOREIGN KEY ("product_id") REFERENCES "public"."products" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
