import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Nodemailer setup
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // API Routes
  app.get("/api/health", async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok", database: "connected" });
    } catch (error) {
      res.json({ status: "ok", database: "disconnected", error: String(error) });
    }
  });

  // ==========================================
  // API: Companies
  // ==========================================
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await prisma.company.findMany({
        include: { _count: { select: { contacts: true, deals: true } } }
      });
      res.json(companies.map(c => ({
        ...c,
        tags: JSON.parse(c.tags || "[]")
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const data = { ...req.body };
      
      const createData: any = {
        name: data.name,
      };

      if (data.industry) createData.industry = data.industry;
      if (data.size) createData.size = data.size;
      if (data.revenue) createData.revenue = data.revenue;
      if (data.city) createData.city = data.city;
      if (data.state) createData.state = data.state;
      if (data.email) createData.email = data.email;
      if (data.phone) createData.phone = data.phone;
      if (data.linkedin) createData.linkedin = data.linkedin;
      if (data.website) createData.website = data.website;
      if (data.address) createData.address = data.address;
      if (data.cnpj) createData.cnpj = data.cnpj;
      if (data.status) createData.status = data.status;
      if (data.tags) createData.tags = JSON.stringify(data.tags);
      if (data.ownerId) createData.ownerId = data.ownerId;

      const company = await prisma.company.create({ data: createData });
      res.json({ ...company, tags: JSON.parse(company.tags || "[]") });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to create company" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await prisma.company.findUnique({
        where: { id: req.params.id },
        include: { contacts: true, deals: true }
      });
      if (company) res.json({ ...company, tags: JSON.parse(company.tags || "[]") });
      else res.status(404).json({ error: "Company not found" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const data = { ...req.body };

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.industry !== undefined) updateData.industry = data.industry;
      if (data.size !== undefined) updateData.size = data.size;
      if (data.revenue !== undefined) updateData.revenue = data.revenue;
      if (data.city !== undefined) updateData.city = data.city;
      if (data.state !== undefined) updateData.state = data.state;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
      if (data.website !== undefined) updateData.website = data.website;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.cnpj !== undefined) updateData.cnpj = data.cnpj;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
      if (data.ownerId !== undefined) updateData.ownerId = data.ownerId;

      const company = await prisma.company.update({
        where: { id: req.params.id },
        data: updateData
      });
      res.json({ ...company, tags: JSON.parse(company.tags || "[]") });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to update company" });
    }
  });

  app.delete("/api/companies/:id", async (req, res) => {
    try {
      await prisma.company.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete company" });
    }
  });

  // ==========================================
  // API: Contacts
  // ==========================================
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await prisma.contact.findMany({
        include: { company: true }
      });
      res.json(contacts.map(c => ({
        ...c,
        company: c.companyName || c.company?.name || '',
        tags: JSON.parse(c.tags || "[]")
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const data = { ...req.body };
      
      const createData: any = {
        name: data.name,
      };
      
      if (data.role) createData.role = data.role;
      if (data.email) createData.email = data.email;
      if (data.phone) createData.phone = data.phone;
      if (data.linkedin) createData.linkedin = data.linkedin;
      if (data.avatar) createData.avatar = data.avatar;
      if (data.status) createData.status = data.status;
      if (data.tags) createData.tags = JSON.stringify(data.tags);
      if (data.company) createData.companyName = data.company;
      if (data.companyId) createData.companyId = data.companyId;

      const contact = await prisma.contact.create({ data: createData });
      res.json({ ...contact, company: contact.companyName, tags: JSON.parse(contact.tags || "[]") });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to create contact" });
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const data = { ...req.body };
      
      const updateData: any = {
        name: data.name,
      };

      if (data.role !== undefined) updateData.role = data.role;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
      if (data.company !== undefined) updateData.companyName = data.company;
      if (data.companyId !== undefined) updateData.companyId = data.companyId;

      const contact = await prisma.contact.update({
        where: { id: req.params.id },
        data: updateData
      });
      res.json({ ...contact, company: contact.companyName, tags: JSON.parse(contact.tags || "[]") });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      await prisma.contact.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // ==========================================
  // API: Dashboard
  // ==========================================
  app.get("/api/dashboard", async (req, res) => {
    try {
      // open deals count
      const openDealsCount = await prisma.deal.count({
        where: { status: 'open' }
      });
      
      // expected revenue (sum of open deals values + draft/sent proposals)
      const openDeals = await prisma.deal.findMany({
        where: { status: 'open' }
      });
      const pendingProposals = await prisma.proposal.findMany({
        where: { status: { in: ['draft', 'sent'] } }
      });
      const expectedRevenue = openDeals.reduce((sum, deal) => sum + deal.value, 0) + 
                              pendingProposals.reduce((sum, p) => sum + p.totalValue, 0);

      // conversion rate (won deals / total deals)
      const totalDeals = await prisma.deal.count();
      const wonDeals = await prisma.deal.count({
        where: { status: 'won' }
      });
      const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

      // pending activities
      const pendingActivitiesCount = await prisma.activity.count({
        where: { status: 'todo' }
      });

      // pipeline data (deals by stage)
      const pipelineGroups = await prisma.deal.groupBy({
        by: ['stage'],
        _count: { id: true },
        _sum: { value: true },
        where: { status: 'open' }
      });
      const pipelineData = pipelineGroups.map(g => ({
        stage: g.stage,
        deals: g._count.id,
        value: g._sum.value || 0
      }));

      // deals at risk (open deals with no recent activities)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dealsAtRiskRaw = await prisma.deal.findMany({
        where: { 
          status: 'open',
          updatedAt: { lt: sevenDaysAgo }
        },
        include: { company: true, owner: true },
        take: 5,
        orderBy: { updatedAt: 'asc' }
      });
      
      const dealsAtRisk = dealsAtRiskRaw.map(d => ({
        id: d.id,
        company: d.company?.name || d.companyName || 'Unknown',
        dealName: d.title,
        value: d.value,
        daysIdle: Math.floor((new Date().getTime() - new Date(d.updatedAt).getTime()) / (1000 * 3600 * 24)),
        owner: d.owner?.name || 'Unassigned',
        avatar: (d.company?.name || d.companyName || 'U').substring(0, 2).toUpperCase()
      }));

      // latest proposals
      const latestProposalsRaw = await prisma.proposal.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      const latestProposals = latestProposalsRaw.map(p => ({
        id: p.id,
        company: p.companyName || 'Unknown',
        value: p.totalValue,
        date: p.createdAt,
        status: p.status
      }));

      // top reps
      const topRepsRaw = await prisma.user.findMany({
        include: {
          deals: {
            where: { status: 'won' }
          }
        },
        take: 5
      });
      const topReps = topRepsRaw.map(u => {
        const revenue = u.deals.reduce((sum, d) => sum + d.value, 0);
        return {
          id: u.id,
          name: u.name || 'Unknown',
          avatar: u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}`,
          deals: u.deals.length,
          revenue: revenue,
          progress: revenue > 0 ? 100 : 0
        };
      }).sort((a, b) => b.revenue - a.revenue);

      // revenue data (last 6 months)
      const revenueData = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        
        const monthlyWonDeals = await prisma.deal.findMany({
          where: {
            status: 'won',
            updatedAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        });
        
        const revenue = monthlyWonDeals.reduce((sum, deal) => sum + deal.value, 0);
        
        revenueData.push({
          month: d.toLocaleString('pt-BR', { month: 'short' }),
          revenue: revenue,
          target: 50000 // Example target
        });
      }

      res.json({
        kpiData: {
          openDeals: { value: openDealsCount, trend: 0, history: [openDealsCount, openDealsCount] },
          expectedRevenue: { value: expectedRevenue, trend: 0, history: [expectedRevenue, expectedRevenue] },
          conversionRate: { value: parseFloat(conversionRate.toFixed(1)), trend: 0, history: [parseFloat(conversionRate.toFixed(1)), parseFloat(conversionRate.toFixed(1))] },
          pendingActivities: { value: pendingActivitiesCount, trend: 0, history: [pendingActivitiesCount, pendingActivitiesCount] }
        },
        pipelineData,
        dealsAtRisk,
        latestProposals,
        topReps,
        revenueData
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // ==========================================
  // API: Users
  // ==========================================

  app.get("/api/users", async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { name: 'asc' }
      });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { name, email, role } = req.body;
      const user = await prisma.user.create({
        data: {
          name,
          email,
          role: role || 'sales',
          status: 'pending'
        }
      });
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { role, status } = req.body;
      const user = await prisma.user.update({
        where: { id },
        data: { role, status }
      });
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id }
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ==========================================
  // API: Deals
  // ==========================================
  app.get("/api/reports", async (req, res) => {
    try {
      const deals = await prisma.deal.findMany({
        include: { owner: true }
      });
      const proposals = await prisma.proposal.findMany();

      // Funnel Data
      const stages = ['prospeccao', 'qualificacao', 'enviada', 'negociacao', 'ganho', 'perdido'];
      const stageNames: Record<string, string> = {
        'prospeccao': 'Prospecção',
        'qualificacao': 'Qualificação',
        'enviada': 'Enviada',
        'negociacao': 'Negociação',
        'ganho': 'Ganho',
        'perdido': 'Perdido'
      };

      const funnelData = stages.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage);
        return {
          stage: stageNames[stage],
          count: stageDeals.length,
          value: stageDeals.reduce((sum, d) => sum + d.value, 0)
        };
      });

      // Rep Performance
      const repsMap = new Map();
      deals.forEach(deal => {
        if (!deal.ownerId) return;
        const ownerName = deal.owner?.name || 'Desconhecido';
        if (!repsMap.has(deal.ownerId)) {
          repsMap.set(deal.ownerId, { name: ownerName, open: 0, won: 0, lost: 0, revenue: 0, target: 100000 });
        }
        const rep = repsMap.get(deal.ownerId);
        if (deal.stage === 'ganho') {
          rep.won += 1;
          rep.revenue += deal.value;
        } else if (deal.stage === 'perdido') {
          rep.lost += 1;
        } else {
          rep.open += 1;
        }
      });

      const repPerformance = Array.from(repsMap.values()).map(rep => {
        const totalClosed = rep.won + rep.lost;
        const winRate = totalClosed > 0 ? Math.round((rep.won / totalClosed) * 100) : 0;
        const avgTicket = rep.won > 0 ? Math.round(rep.revenue / rep.won) : 0;
        return { ...rep, winRate, avgTicket };
      });

      // Proposals Data
      const proposalsData = [
        { name: 'Enviadas', value: proposals.filter(p => p.status === 'SENT').length, color: '#3b82f6' },
        { name: 'Aceitas', value: proposals.filter(p => p.status === 'ACCEPTED').length, color: '#10b981' },
        { name: 'Recusadas', value: proposals.filter(p => p.status === 'REJECTED').length, color: '#ef4444' },
        { name: 'Rascunho', value: proposals.filter(p => p.status === 'DRAFT').length, color: '#f59e0b' },
      ];

      // Forecast Data (Mocked for now, can be calculated from deals expectedCloseDate)
      const forecastData = [
        { month: 'Jan', pessimist: 40000, realist: 55000, optimist: 70000, actual: 52000 },
        { month: 'Fev', pessimist: 45000, realist: 60000, optimist: 80000, actual: 61000 },
        { month: 'Mar', pessimist: 50000, realist: 65000, optimist: 85000, actual: 68000 },
        { month: 'Abr', pessimist: 55000, realist: 75000, optimist: 95000, actual: null },
        { month: 'Mai', pessimist: 60000, realist: 80000, optimist: 100000, actual: null },
        { month: 'Jun', pessimist: 65000, realist: 90000, optimist: 110000, actual: null },
      ];

      // Top Products Data (Extracted from proposals)
      const productCounts: Record<string, { count: number; revenue: number }> = {};
      proposals.forEach(p => {
        if (p.services && Array.isArray(p.services)) {
          p.services.forEach((s: any) => {
            if (!productCounts[s.description]) {
              productCounts[s.description] = { count: 0, revenue: 0 };
            }
            productCounts[s.description].count += s.quantity || 1;
            productCounts[s.description].revenue += (s.quantity || 1) * (s.unitPrice || 0);
          });
        }
      });
      const topProducts = Object.entries(productCounts)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Activity Data (Mocked for now)
      const activityData = [
        { name: 'Seg', call: 12, email: 25, meeting: 4, task: 8 },
        { name: 'Ter', call: 18, email: 32, meeting: 6, task: 12 },
        { name: 'Qua', call: 15, email: 28, meeting: 5, task: 10 },
        { name: 'Qui', call: 22, email: 35, meeting: 8, task: 15 },
        { name: 'Sex', call: 10, email: 20, meeting: 3, task: 5 },
      ];

      res.json({
        funnelData,
        repPerformance,
        proposalsData,
        forecastData,
        topProducts,
        activityData
      });
    } catch (error) {
      console.error("Error generating reports:", error);
      res.status(500).json({ error: "Failed to generate reports" });
    }
  });
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await prisma.deal.findMany({
        include: { company: true, contact: true }
      });
      res.json(deals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const data = { ...req.body };
      
      const createData: any = {
        title: data.title,
        stage: data.stage,
      };

      if (data.value !== undefined) createData.value = data.value;
      if (data.status) createData.status = data.status;
      if (data.probability !== undefined) createData.probability = data.probability;
      if (data.expectedCloseDate) createData.expectedCloseDate = new Date(data.expectedCloseDate);
      if (data.companyName) createData.companyName = data.companyName;
      if (data.companyId) createData.companyId = data.companyId;
      if (data.contactId) createData.contactId = data.contactId;
      if (data.ownerId) createData.ownerId = data.ownerId;

      const deal = await prisma.deal.create({ data: createData });
      res.json(deal);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to create deal" });
    }
  });

  app.put("/api/deals/:id", async (req, res) => {
    try {
      const data = { ...req.body };
      
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.value !== undefined) updateData.value = data.value;
      if (data.stage !== undefined) updateData.stage = data.stage;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.probability !== undefined) updateData.probability = data.probability;
      if (data.expectedCloseDate !== undefined) updateData.expectedCloseDate = data.expectedCloseDate ? new Date(data.expectedCloseDate) : null;
      if (data.companyName !== undefined) updateData.companyName = data.companyName;
      if (data.companyId !== undefined) updateData.companyId = data.companyId;
      if (data.contactId !== undefined) updateData.contactId = data.contactId;
      if (data.ownerId !== undefined) updateData.ownerId = data.ownerId;

      const deal = await prisma.deal.update({
        where: { id: req.params.id },
        data: updateData
      });
      res.json(deal);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to update deal" });
    }
  });

  app.delete("/api/deals/:id", async (req, res) => {
    try {
      await prisma.deal.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete deal" });
    }
  });

  app.patch("/api/deals/:id/stage", async (req, res) => {
    try {
      const deal = await prisma.deal.update({
        where: { id: req.params.id },
        data: { stage: req.body.stage }
      });
      res.json(deal);
    } catch (error) {
      res.status(500).json({ error: "Failed to update deal stage" });
    }
  });

  // ==========================================
  // API: Activities
  // ==========================================
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await prisma.activity.findMany();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activity = await prisma.activity.create({ data: req.body });
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  // ==========================================
  // Google OAuth Endpoints
  // ==========================================
  app.get("/api/auth/google/url", (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    res.json({ url: authUrl });
  });

  app.get(["/api/auth/google/callback", "/api/auth/google/callback/"], async (req, res) => {
    const { code } = req.query;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

    try {
      if (!code) throw new Error("No code provided");

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(tokenData.error_description || "Failed to get tokens");

      // Get user info
      const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const userData = await userResponse.json();

      // Send success message to parent window and close popup
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  user: {
                    id: "${userData.id}",
                    name: "${userData.name}",
                    email: "${userData.email}",
                    avatar: "${userData.picture}",
                    role: "viewer"
                  },
                  token: "${tokenData.access_token}"
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Autenticação com sucesso. Esta janela fechará automaticamente.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("OAuth error:", error);
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR' }, '*');
                window.close();
              }
            </script>
            <p>Erro na autenticação. Feche a janela e tente novamente.</p>
          </body>
        </html>
      `);
    }
  });

  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await prisma.proposal.findMany({
        include: { deal: true, template: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await prisma.proposalTemplate.findMany();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const { templates } = req.body;
      
      // Basic sync: delete all and recreate (for simplicity in this example)
      await prisma.proposalTemplate.deleteMany();
      
      const created = await prisma.proposalTemplate.createMany({
        data: templates.map((t: any) => ({
          name: t.name,
          logo: t.logo || null,
          primaryColor: t.primaryColor,
          companyName: t.companyName,
          companyInfo: t.companyInfo || null
        }))
      });
      
      res.json(created);
    } catch (error) {
      console.error("Error saving templates:", error);
      res.status(500).json({ error: "Failed to save templates" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const { dealId, totalValue, observations, services, status, templateId, title, companyName, contactName, validUntil, message } = req.body;
      const linkHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const proposal = await prisma.proposal.create({
        data: {
          title: title || "Proposta Comercial",
          dealId,
          templateId,
          companyName,
          contactName,
          validUntil: validUntil ? new Date(validUntil) : null,
          message,
          totalValue,
          observations,
          services,
          status,
          linkHash
        }
      });
      res.json(proposal);
    } catch (error) {
      console.error("Error creating proposal:", error);
      res.status(500).json({ error: "Failed to create proposal" });
    }
  });

  app.get("/api/proposals/:hash", async (req, res) => {
    try {
      const { hash } = req.params;
      const proposal = await prisma.proposal.findUnique({
        where: { linkHash: hash },
        include: { deal: true, template: true }
      });
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ error: "Failed to fetch proposal" });
    }
  });

  app.get("/api/proposals/public/:hash", async (req, res) => {
    try {
      const { hash } = req.params;
      let proposal = await prisma.proposal.findUnique({
        where: { linkHash: hash },
        include: { deal: true, template: true }
      });
      if (!proposal) {
        proposal = await prisma.proposal.findUnique({
          where: { id: hash },
          include: { deal: true, template: true }
        });
      }
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error fetching public proposal:", error);
      res.status(500).json({ error: "Failed to fetch proposal" });
    }
  });

  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id === 'hash') return; // skip if it's the hash route
      const proposal = await prisma.proposal.findUnique({
        where: { id },
        include: { deal: true, template: true }
      });
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ error: "Failed to fetch proposal" });
    }
  });

  app.put("/api/proposals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { dealId, totalValue, observations, services, status, templateId, title, companyName, contactName, validUntil, message } = req.body;
      
      const updateData: any = {};
      
      if (dealId !== undefined) updateData.dealId = dealId;
      if (totalValue !== undefined) updateData.totalValue = totalValue;
      if (observations !== undefined) updateData.observations = observations;
      if (services !== undefined) updateData.services = services;
      if (status !== undefined) updateData.status = status;
      if (templateId !== undefined) updateData.templateId = templateId;
      if (title !== undefined) updateData.title = title;
      if (companyName !== undefined) updateData.companyName = companyName;
      if (contactName !== undefined) updateData.contactName = contactName;
      if (message !== undefined) updateData.message = message;

      if (validUntil !== undefined) {
        updateData.validUntil = validUntil ? new Date(validUntil) : null;
      }
      
      const proposal = await prisma.proposal.update({
        where: { id },
        data: updateData
      });

      // Update deal stage based on proposal status
      if (status && proposal.dealId) {
        let newStage = null;
        if (status === 'SENT') newStage = 'enviada';
        else if (status === 'ACCEPTED') newStage = 'ganho';
        else if (status === 'REJECTED') newStage = 'perdido';

        if (newStage) {
          await prisma.deal.update({
            where: { id: proposal.dealId },
            data: { stage: newStage }
          });
        }
      }

      res.json(proposal);
    } catch (error) {
      console.error("Error updating proposal:", error);
      res.status(500).json({ error: "Failed to update proposal" });
    }
  });

  app.delete("/api/proposals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.proposal.delete({
        where: { id }
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting proposal:", error);
      res.status(500).json({ error: "Failed to delete proposal" });
    }
  });

  app.post("/api/proposals/:id/send", async (req, res) => {
    try {
      const { id } = req.params;
      const { to, subject, message } = req.body || {};
      
      const proposal = await prisma.proposal.findUnique({
        where: { id },
        include: { deal: { include: { contact: true } } }
      });

      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }

      const toEmail = to || proposal.deal?.contact?.email;
      if (!toEmail) {
        return res.status(400).json({ error: "Contact email not found for this proposal" });
      }

      const proposalLink = `${process.env.APP_URL || 'http://localhost:3000'}/p/${proposal.linkHash}`;
      
      const mailOptions = {
        from: process.env.SMTP_FROM || '"CRM" <nao-responda@suaempresa.com.br>',
        to: toEmail,
        subject: subject || `Proposta Comercial: ${proposal.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Olá ${proposal.contactName || proposal.deal?.contact?.name || 'Cliente'},</h2>
            <p>${message ? message.replace(/\n/g, '<br>') : 'Apresentamos nossa proposta comercial para os serviços solicitados.'}</p>
            <div style="margin: 30px 0;">
              <a href="${proposalLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Visualizar Proposta Completa
              </a>
            </div>
            <p>Atenciosamente,<br>Equipe Comercial</p>
          </div>
        `
      };

      if (process.env.SMTP_HOST === 'smtp.mailtrap.io' || !process.env.SMTP_HOST) {
        console.log("Mocking email send to:", toEmail);
        console.log("Email content:", mailOptions.html);
      } else {
        await transporter.sendMail(mailOptions);
      }

      const updatedProposal = await prisma.proposal.update({
        where: { id },
        data: { status: 'sent' }
      });

      res.json(updatedProposal);
    } catch (error) {
      console.error("Error sending proposal email:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to send email" });
    }
  });

  app.post("/api/proposals/:id/accept", async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await prisma.proposal.update({
        where: { id },
        data: { status: 'ACCEPTED' }
      });
      
      if (proposal.dealId) {
        await prisma.deal.update({
          where: { id: proposal.dealId },
          data: { status: 'WON', stage: 'ganho' }
        });
      }
      
      res.json(proposal);
    } catch (error) {
      console.error("Error accepting proposal:", error);
      res.status(500).json({ error: "Failed to accept proposal" });
    }
  });

  app.post("/api/proposals/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await prisma.proposal.update({
        where: { id },
        data: { status: 'REJECTED' }
      });

      if (proposal.dealId) {
        await prisma.deal.update({
          where: { id: proposal.dealId },
          data: { status: 'LOST', stage: 'perdido' }
        });
      }

      res.json(proposal);
    } catch (error) {
      console.error("Error rejecting proposal:", error);
      res.status(500).json({ error: "Failed to reject proposal" });
    }
  });

  app.get("/api/propostas/:id/pdf", (req, res) => {
    // In a real app, we would generate the PDF here using @react-pdf/renderer
    // For now, we'll just return a mock response or stream
    res.json({ message: "PDF generation endpoint" });
  });

  app.post("/api/propostas/:id/email", async (req, res) => {
    const { id } = req.params;
    const { to, subject, message } = req.body;
    
    try {
      // Mock email sending with Nodemailer
      if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'seu_usuario') {
        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || '"CRM Pro" <crm@example.com>',
          to,
          subject,
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #2563eb;">Proposta Comercial</h2>
              <p style="white-space: pre-wrap; color: #374151;">${message}</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/api/propostas/${id}/pdf" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visualizar Proposta em PDF</a>
              </div>
              <img src="${process.env.APP_URL || 'http://localhost:3000'}/api/propostas/${id}/tracking" width="1" height="1" style="display:none;" />
            </div>
          `,
        });
        console.log(`Email sent: ${info.messageId}`);
      } else {
        console.log(`Mock email sent to ${to} (SMTP not configured or using placeholder credentials)`);
      }
      
      // Update status
      await prisma.proposal.update({
        where: { id },
        data: { status: 'SENT' }
      });

      res.json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: error.message || "Failed to send email" });
    }
  });

  app.patch("/api/propostas/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const proposal = await prisma.proposal.update({
        where: { id },
        data: { status }
      });
      res.json(proposal);
    } catch (error) {
      console.error("Error updating proposal status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.get("/api/propostas/:id/tracking", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Update status to viewed
      const proposal = await prisma.proposal.findUnique({ where: { id } });
      if (proposal && proposal.status === 'SENT') {
        await prisma.proposal.update({
          where: { id },
          data: { status: 'VIEWED' }
        });
      }

      // Return a 1x1 transparent pixel
      const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length,
      });
      res.end(pixel);
    } catch (error) {
      console.error("Error tracking proposal:", error);
      res.status(500).end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
