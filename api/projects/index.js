import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      // List all projects, sorted by most recent first
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit to last 50 projects
      })
      return res.status(200).json(projects)
    }

    if (req.method === 'POST') {
      const { name, data } = req.body

      if (!name || !data) {
        return res.status(400).json({ error: 'Name and data are required' })
      }

      const project = await prisma.project.create({
        data: {
          name: name.slice(0, 100), // Limit name length
          data
        }
      })

      return res.status(201).json(project)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
