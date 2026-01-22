
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const users = [
        {
            name: 'Rafael Lacerda',
            username: 'rafael_lacerda',
            passwordRaw: 'Rafa2101!',
            role: 'partner',
        },
        {
            name: 'Alvaro Cruz',
            username: 'alvaro_cruz',
            passwordRaw: 'Cruz2101!',
            role: 'affiliate',
        },
    ];

    console.log('Start seeding users...');

    for (const u of users) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { username: u.username },
        });

        if (existingUser) {
            console.log(`User ${u.username} already exists. Updating password/role...`);
            const hashedPassword = await bcrypt.hash(u.passwordRaw, 10);
            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    password: hashedPassword,
                    role: u.role,
                    name: u.name
                },
            });
            console.log(`Updated ${u.username}`);
        } else {
            console.log(`Creating user ${u.username}...`);
            const hashedPassword = await bcrypt.hash(u.passwordRaw, 10);
            await prisma.user.create({
                data: {
                    name: u.name,
                    username: u.username,
                    password: hashedPassword,
                    role: u.role,
                },
            });
            console.log(`Created ${u.username}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
