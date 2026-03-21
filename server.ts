import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

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
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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

  // Mock Proposals DB
  const proposals: any[] = [];

  app.post("/api/propostas", (req, res) => {
    const newProposal = {
      id: `PROP-${Date.now().toString().slice(-4)}`,
      ...req.body,
      status: 'draft',
      date: new Date().toISOString()
    };
    proposals.push(newProposal);
    res.json(newProposal);
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
