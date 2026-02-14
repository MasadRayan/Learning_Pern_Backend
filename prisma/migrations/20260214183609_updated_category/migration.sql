-- First, update existing NULL values with defaults

-- Update NULL slugs with generated values from name
UPDATE "Category" 
SET "slug" = LOWER(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g'))
WHERE "slug" IS NULL;

-- Update NULL descriptions with a default value
UPDATE "Category" 
SET "description" = 'No description provided'
WHERE "description" IS NULL;

-- Update NULL imageUrls with a default placeholder
UPDATE "Category" 
SET "imageUrl" = 'https://via.placeholder.com/300'
WHERE "imageUrl" IS NULL;

-- Now drop the unique constraint on name
DROP INDEX "Category_name_key";

-- Make the columns required (NOT NULL)
ALTER TABLE "Category" 
  ALTER COLUMN "slug" SET NOT NULL,
  ALTER COLUMN "description" SET NOT NULL,
  ALTER COLUMN "imageUrl" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "Category" 
ADD CONSTRAINT "Category_parentId_fkey" 
FOREIGN KEY ("parentId") REFERENCES "Category"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;