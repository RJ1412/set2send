import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log('[Migration] Running story trigger migration...');
  // Update campaigns where keyword is STORY_MENTION (with or without quotes) to trigger_type story_mention
  const result = await prisma.campaign.updateMany({
    where: {
      OR: [
        { keyword: 'STORY_MENTION' },
        { keyword: '"STORY_MENTION"' },
        { keyword: 'story_mention' },
        { keyword: '"story_mention"' }
      ],
      trigger_type: 'comment'
    },
    data: {
      trigger_type: 'story_mention'
    }
  });
  console.log(`[Migration] Successfully updated ${result.count} campaigns to story_mention.`);
}

run()
  .catch(err => console.error('[Migration] Failed:', err))
  .finally(() => prisma.$disconnect());
