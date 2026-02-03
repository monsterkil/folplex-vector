import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Project ID is required' })
  }

  try {
    if (req.method === 'GET') {
      const project = await prisma.project.findUnique({
        where: { id }
      })

      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      return res.status(200).json(project)
    }

    if (req.method === 'PUT') {
      const { name, data } = req.body

      if (!name || !data) {
        return res.status(400).json({ error: 'Name and data are required' })
      }

      const project = await prisma.project.update({
        where: { id },
        data: {
          name: name.slice(0, 100),
          data
        }
      })

      return res.status(200).json(project)
    }

    if (req.method === 'DELETE') {
      await prisma.project.delete({
        where: { id }
      })

      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
