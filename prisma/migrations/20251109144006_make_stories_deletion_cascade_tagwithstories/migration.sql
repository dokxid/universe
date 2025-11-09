-- DropForeignKey
ALTER TABLE "public"."tags_on_stories" DROP CONSTRAINT "tags_on_stories_storyId_fkey";

-- AddForeignKey
ALTER TABLE "tags_on_stories" ADD CONSTRAINT "tags_on_stories_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
