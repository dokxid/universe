-- DropForeignKey
ALTER TABLE "public"."story" DROP CONSTRAINT "story_labId_fkey";

-- AddForeignKey
ALTER TABLE "story" ADD CONSTRAINT "story_labId_fkey" FOREIGN KEY ("labId") REFERENCES "lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;
