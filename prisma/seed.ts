import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Cleaning database...')

    // Delete in order to respect foreign keys
    await prisma.saleItem.deleteMany()
    await prisma.sale.deleteMany()
    await prisma.client.deleteMany()
    await prisma.product.deleteMany()
    await prisma.affiliateSeller.deleteMany()
    await prisma.partnerProfile.deleteMany()
    await prisma.user.deleteMany()

    console.log('Database cleaned.')

    // 1. Create Admin User (nwolfyz)
    const hashedPassword = await bcrypt.hash('2002', 10)

    const admin = await prisma.user.create({
        data: {
            name: 'Nicolas Lobo',
            username: 'nwolfyz',
            password: hashedPassword,
            role: 'admin',
        },
    })
    console.log('Admin user created:', admin.username)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
