import { storage } from './storage';

async function main() {
  try {
    const demoId = 'demo-user-1';
    const user = await storage.upsertUser({
      id: demoId,
      email: 'demo@local',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: '',
    } as any);

    const img1 = await storage.createGeneratedImage({
      userId: user.id,
      prompt: 'A vibrant sunset over a mountain lake, ultra-detailed',
      imageUrl: 'https://placehold.co/1024x1024',
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
    } as any);

    const img2 = await storage.createGeneratedImage({
      userId: user.id,
      prompt: 'Minimalist illustration of a futuristic city skyline at night',
      imageUrl: 'https://placehold.co/1024x1024',
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'hd',
    } as any);

    console.log(JSON.stringify({ user, images: [img1, img2] }, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Seeding error', e);
    process.exit(1);
  }
}

main();
