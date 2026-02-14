/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `slug` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/

-- Step 1: Add the new title column as nullable first
ALTER TABLE "Product" ADD COLUMN "title" VARCHAR(255);

-- Step 2: Copy data from name to title
UPDATE "Product" SET "title" = "name";

-- Step 3: Now make title NOT NULL (safe because we just populated it)
ALTER TABLE "Product" ALTER COLUMN "title" SET NOT NULL;

-- Step 4: Drop the old name column
ALTER TABLE "Product" DROP COLUMN "name";

-- Step 5: Handle NULL slugs - generate from title
UPDATE "Product" 
SET "slug" = LOWER(REGEXP_REPLACE("title", '[^a-zA-Z0-9]+', '-', 'g'))
WHERE "slug" IS NULL;

-- Step 6: Make slug NOT NULL
ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;

-- Step 7: Handle NULL descriptions
UPDATE "Product" 
SET "description" = 'No description available'
WHERE "description" IS NULL;

-- Step 8: Make description NOT NULL
ALTER TABLE "Product" ALTER COLUMN "description" SET NOT NULL;