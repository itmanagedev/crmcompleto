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
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
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
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const company = await prisma.company.create({ data: req.body });
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to create company" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await prisma.company.findUnique({
        where: { id: req.params.id },
        include: { contacts: true, deals: true }
      });
      if (company) res.json(company);
      else res.status(404).json({ error: "Company not found" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const company = await prisma.company.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company" });
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
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contact = await prisma.contact.create({ data: req.body });
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  // ==========================================
  // API: Deals
  // ==========================================
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
      const deal = await prisma.deal.create({ data: req.body });
      res.json(deal);
    } catch (error) {
      res.status(500).json({ error: "Failed to create deal" });
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
      const { dealId, totalValue, observations, services, status, templateId, title } = req.body;
      const linkHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const proposal = await prisma.proposal.create({
        data: {
          title: title || "Proposta Comercial",
          dealId,
          templateId,
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
          data: { status: 'WON' }
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
      const info = await transporter.sendMail({
        from: '"CRM Pro" <crm@example.com>',
        to,
        subject,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #2563eb;">Proposta Comercial</h2>
            <p style="white-space: pre-wrap; color: #374151;">${message}</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <a href="http://localhost:3000/api/propostas/${id}/pdf" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visualizar Proposta em PDF</a>
            </div>
            <img src="http://localhost:3000/api/propostas/${id}/tracking" width="1" height="1" style="display:none;" />
          </div>
        `,
      });
      
      console.log(`Email sent: ${info.messageId}`);
      
      // Update status
      const proposal = proposals.find(p => p.id === id);
      if (proposal) {
        proposal.status = 'sent';
      }

      res.json({ success: true, message: "Email sent successfully", messageId: info.messageId });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.patch("/api/propostas/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const proposal = proposals.find(p => p.id === id);
    if (proposal) {
      proposal.status = status;
      res.json(proposal);
    } else {
      res.status(404).json({ error: "Proposal not found" });
    }
  });

  app.get("/api/propostas/:id/tracking", (req, res) => {
    const { id } = req.params;
    
    // Update status to viewed
    const proposal = proposals.find(p => p.id === id);
    if (proposal && proposal.status === 'sent') {
      proposal.status = 'viewed';
    }

    // Return a 1x1 transparent pixel
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
    });
    res.end(pixel);
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
