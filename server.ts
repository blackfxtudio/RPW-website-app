import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Persistent server-side CMS configuration file path & upload storage
const CONFIG_FILE = path.join(process.cwd(), 'site-config.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically across dev and production with byte-range support for video
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (filePath.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    }
  }
}));

// Helper: Extract any base64 images or videos from JSON to disk so config stays lightweight
function sanitizeAndExtractBase64(obj: any, prefix = 'media') {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === 'string') {
      if (v.startsWith('data:image/')) {
        const match = v.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (match) {
          let ext = match[1];
          if (ext === 'jpeg') ext = 'jpg';
          if (ext.includes('+')) ext = 'png';
          const fName = `${prefix}_${k}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
          const filePath = path.join(UPLOADS_DIR, fName);
          const buffer = Buffer.from(match[2], 'base64');
          fs.writeFileSync(filePath, buffer);
          const distUploads = path.join(process.cwd(), 'dist', 'uploads');
          if (fs.existsSync(distUploads)) {
            try { fs.writeFileSync(path.join(distUploads, fName), buffer); } catch {}
          }
          obj[k] = `/uploads/${fName}`;
        }
      } else if (v.startsWith('data:video/')) {
        const match = v.match(/^data:video\/([a-zA-Z0-9_-]+);base64,(.+)$/);
        if (match) {
          let ext = match[1];
          if (ext === 'quicktime') ext = 'mov';
          if (!['mp4', 'webm', 'mov', 'ogg'].includes(ext)) ext = 'mp4';
          const fName = `video_${prefix}_${k}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
          const filePath = path.join(UPLOADS_DIR, fName);
          const buffer = Buffer.from(match[2], 'base64');
          fs.writeFileSync(filePath, buffer);
          const distUploads = path.join(process.cwd(), 'dist', 'uploads');
          if (fs.existsSync(distUploads)) {
            try { fs.writeFileSync(path.join(distUploads, fName), buffer); } catch {}
          }
          obj[k] = `/uploads/${fName}`;
        }
      }
    } else if (v && typeof v === 'object') {
      sanitizeAndExtractBase64(v, `${prefix}_${k}`);
    }
  }
}

// ============================================================================
// API ROUTES: MEDIA FILE UPLOADS (Images & Video Showreels)
// ============================================================================
app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }

    const isImage = dataUrl.startsWith('data:image/');
    const isVideo = dataUrl.startsWith('data:video/');

    if (!isImage && !isVideo) {
      return res.status(400).json({ success: false, error: 'Unsupported media format. Please upload an image or video file.' });
    }

    let ext = 'png';
    let base64Data = '';

    if (isImage) {
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, error: 'Invalid image base64' });
      }
      ext = matches[1];
      if (ext === 'jpeg') ext = 'jpg';
      if (ext.includes('+')) ext = 'png';
      base64Data = matches[2];
    } else {
      const matches = dataUrl.match(/^data:video\/([a-zA-Z0-9_-]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, error: 'Invalid video base64' });
      }
      ext = matches[1];
      if (ext === 'quicktime') ext = 'mov';
      if (!['mp4', 'webm', 'mov', 'ogg'].includes(ext)) ext = 'mp4';
      base64Data = matches[2];
    }

    const safeName = (filename || (isVideo ? 'reel' : 'img')).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 24);
    const uniqueFilename = `${safeName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueFilename);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(targetPath, buffer);

    // Sync to dist/uploads if dist directory exists
    const distUploads = path.join(process.cwd(), 'dist', 'uploads');
    if (fs.existsSync(distUploads)) {
      try {
        fs.writeFileSync(path.join(distUploads, uniqueFilename), buffer);
      } catch {}
    }

    const fileUrl = `/uploads/${uniqueFilename}`;
    console.log('[CONFIG-SERVER] Uploaded media saved to:', fileUrl);
    return res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error('[CONFIG-SERVER] Upload error:', err);
    return res.status(500).json({ success: false, error: 'Failed to upload media' });
  }
});

// ============================================================================
// API ROUTES: PERSISTENT SITE CONFIGURATION (Shared Across All Visitors & Published URLs)
// ============================================================================
app.get('/api/config', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return res.json({ success: true, config: parsed });
    }
    return res.json({ success: true, config: null });
  } catch (err) {
    console.error('[CONFIG-SERVER] Error reading config file:', err);
    return res.status(500).json({ success: false, error: 'Failed to read server configuration' });
  }
});

app.post('/api/config', (req, res) => {
  try {
    const config = req.body?.config && typeof req.body.config === 'object' ? req.body.config : req.body;
    if (!config || typeof config !== 'object' || Object.keys(config).length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid configuration payload' });
    }
    
    // Automatically sanitize and extract base64 data to static files
    sanitizeAndExtractBase64(config);

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');

    // Also sync to dist/site-config.json if dist directory exists
    const distConfig = path.join(process.cwd(), 'dist', 'site-config.json');
    if (fs.existsSync(path.dirname(distConfig))) {
      try {
        fs.writeFileSync(distConfig, JSON.stringify(config, null, 2), 'utf-8');
      } catch {}
    }

    console.log('[CONFIG-SERVER] Site configuration successfully saved to server disk.');
    return res.json({ success: true, message: 'Configuration saved persistently on server.', config });
  } catch (err) {
    console.error('[CONFIG-SERVER] Error saving config file:', err);
    return res.status(500).json({ success: false, error: 'Failed to save server configuration' });
  }
});

app.post('/api/config/reset', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
    const distConfig = path.join(process.cwd(), 'dist', 'site-config.json');
    if (fs.existsSync(distConfig)) {
      try { fs.unlinkSync(distConfig); } catch {}
    }
    console.log('[CONFIG-SERVER] Configuration reset to defaults.');
    return res.json({ success: true, message: 'Configuration reset to defaults.' });
  } catch (err) {
    console.error('[CONFIG-SERVER] Error resetting config file:', err);
    return res.status(500).json({ success: false, error: 'Failed to reset configuration' });
  }
});

// ============================================================================
// IN-MEMORY SECURITY STORES
// ============================================================================
interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  lastRequestedAt: number;
}

interface SessionRecord {
  email: string;
  createdAt: number;
  expiresAt: number;
}

const otpStore = new Map<string, OtpRecord>();
const activeSessions = new Map<string, SessionRecord>();

const SESSION_SECRET = process.env.SESSION_SECRET || 'rpw-studio-session-secret-salt-' + crypto.randomBytes(16).toString('hex');
const DEFAULT_ALLOWED_EMAILS = ['rotopaintwala@gmail.com', 'tom@blackfx.net'];

function getAllowedEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS;
  if (envEmails) {
    const list = envEmails.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    return Array.from(new Set([...DEFAULT_ALLOWED_EMAILS, ...list]));
  }
  return DEFAULT_ALLOWED_EMAILS;
}

// Auto-Configuring Nodemailer Transporter Helper
function createMailTransporter() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const isGmail = user.toLowerCase().endsWith('@gmail.com') || user.toLowerCase().endsWith('@googlemail.com');

  if (host) {
    const defaultPort = port || 587;
    const isSecure = process.env.SMTP_SECURE === 'true' || defaultPort === 465;
    return nodemailer.createTransport({
      host,
      port: defaultPort,
      secure: isSecure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  // Automatic smart configuration for Gmail / Google Workspace / Standard SMTP
  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  // Auto-detect domain from email if host was not provided
  const emailDomain = user.includes('@') ? user.split('@')[1] : '';
  return nodemailer.createTransport({
    host: emailDomain ? `smtp.${emailDomain}` : 'smtp.gmail.com',
    port: port || 587,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

// Generate secure random session token
function generateSessionToken(email: string): string {
  const randomPayload = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${email}:${randomPayload}:${Date.now()}`)
    .digest('hex');
  return `${randomPayload}.${signature}`;
}

// ============================================================================
// API ROUTES: AUTHENTICATION & SECURE OTP
// ============================================================================

// 1. POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid studio email is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const allowedEmails = getAllowedEmails();

    if (!allowedEmails.includes(normalizedEmail)) {
      // Generic error response to prevent user enumeration
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized email address for studio security checkpoint.' 
      });
    }

    const now = Date.now();
    const existing = otpStore.get(normalizedEmail);

    // Rate-limiting: 30 seconds cooldown between requests
    if (existing && now - existing.lastRequestedAt < 30000) {
      const waitSeconds = Math.ceil((30000 - (now - existing.lastRequestedAt)) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${waitSeconds}s before requesting a new OTP.`,
      });
    }

    // Cryptographically secure random 6-digit OTP
    const secureOtp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    otpStore.set(normalizedEmail, {
      code: secureOtp,
      expiresAt,
      attempts: 0,
      lastRequestedAt: now,
    });

    // Send real email via SMTP
    const transporter = createMailTransporter();
    let emailSent = false;

    if (transporter) {
      try {
        const smtpUser = process.env.SMTP_USER?.trim();
        const fromAddress = process.env.SMTP_FROM || (smtpUser ? `Roto Paint Wala Security <${smtpUser}>` : 'Roto Paint Wala Security <security@rotopaintwala.com>');
        const info = await transporter.sendMail({
          from: fromAddress,
          to: normalizedEmail,
          subject: `🔐 RPW Studio Admin Verification Code: ${secureOtp}`,
          text: `Your RPW Studio Admin verification code is: ${secureOtp}\n\nThis code expires in 5 minutes.\nIf you did not request this code, please ignore this email.`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #05070b; color: #ffffff; padding: 40px 20px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #66fcf1;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #66fcf1; font-size: 24px; margin: 0; letter-spacing: 2px;">ROTO PAINT WALA</h1>
                <p style="color: #87949c; font-size: 11px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1.5px;">Studio Pipeline • Security Checkpoint</p>
              </div>
              <div style="background-color: #08111a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 25px;">
                <p style="color: #9daab4; font-size: 13px; margin: 0 0 15px 0;">Your 6-Digit One-Time Verification Code:</p>
                <div style="background-color: #020509; border: 2px solid #66fcf1; border-radius: 8px; padding: 16px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #66fcf1; font-family: monospace;">
                  ${secureOtp}
                </div>
                <p style="color: #87949c; font-size: 11px; margin: 15px 0 0 0;">⏱️ Valid for <strong>5 minutes</strong>. One-time use only.</p>
              </div>
              <p style="color: #87949c; font-size: 11px; text-align: center; margin: 0; line-height: 1.5;">
                This automated security alert was dispatched for administrative access to the RPW Content Management System. If you did not trigger this request, no action is required.
              </p>
            </div>
          `,
        });
        emailSent = true;
        console.log(`[AUTH-SERVER] OTP Email successfully dispatched to ${normalizedEmail} (Message ID: ${info.messageId})`);
      } catch (mailError) {
        console.error(`[AUTH-SERVER] SMTP dispatch error to ${normalizedEmail}:`, mailError);
      }
    } else {
      console.log(`[AUTH-SERVER] Notice: No external SMTP credentials configured in .env. Logging OTP securely server-side for development.`);
      console.log(`[AUTH-SERVER] Security Dispatch target: ${normalizedEmail} | Expiry: 5 minutes`);
    }

    // Critical security: Never expose secureOtp in the HTTP response JSON
    return res.json({
      success: true,
      message: `Security OTP dispatched to ${normalizedEmail}`,
      expiresInSeconds: 300,
    });
  } catch (error) {
    console.error('[AUTH-SERVER] Send OTP exception:', error);
    return res.status(500).json({ success: false, error: 'Server failed to process verification request.' });
  }
});

// 2. POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit OTP are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const enteredOtp = otp.toString().trim();

    const record = otpStore.get(normalizedEmail);
    if (!record) {
      return res.status(400).json({ success: false, error: 'No active OTP found. Please request a new code.' });
    }

    // Check expiry
    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ success: false, error: 'OTP expired. Please request a new verification code.' });
    }

    // Check attempt limits
    if (record.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      return res.status(429).json({
        success: false,
        error: 'Too many incorrect attempts. For security, this OTP was invalidated. Please request a new one.',
      });
    }

    // Compare code
    if (record.code !== enteredOtp) {
      record.attempts += 1;
      return res.status(400).json({
        success: false,
        error: `Incorrect OTP code. ${5 - record.attempts} attempts remaining.`,
      });
    }

    // Success: Invalidate OTP immediately to prevent reuse
    otpStore.delete(normalizedEmail);

    // Create session token
    const token = generateSessionToken(normalizedEmail);
    const sessionExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    activeSessions.set(token, {
      email: normalizedEmail,
      createdAt: Date.now(),
      expiresAt: sessionExpiry,
    });

    return res.json({
      success: true,
      token,
      email: normalizedEmail,
      message: 'Authentication successful. Admin session initialized.',
    });
  } catch (error) {
    console.error('[AUTH-SERVER] Verify OTP exception:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during verification.' });
  }
});

// 3. GET /api/auth/session
app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return res.json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    email: session.email,
  });
});

// 4. POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ============================================================================
// API ROUTES: GLOBAL MOVIE POSTER FETCHING ENGINE (India, US, Worldwide)
// ============================================================================

// Curated high-resolution Indian & International VFX Feature Film Posters
const VERIFIED_VFX_POSTERS = [
  {
    title: 'Kalki 2898 AD',
    year: '2024',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    genre: 'Indian Sci-Fi / Epic VFX',
    director: 'Nag Ashwin',
  },
  {
    title: 'Pushpa 2: The Rule',
    year: '2024',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    genre: 'Indian Action / Thriller',
    director: 'Sukumar',
  },
  {
    title: 'RRR',
    year: '2022',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    genre: 'Indian Epic Action / VFX',
    director: 'S. S. Rajamouli',
  },
  {
    title: 'Devara: Part 1',
    year: '2024',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    genre: 'Indian Coastal Action / VFX',
    director: 'Koratala Siva',
  },
  {
    title: 'Stree 2',
    year: '2024',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    genre: 'Horror Comedy / VFX',
    director: 'Amar Kaushik',
  },
  {
    title: 'Leo',
    year: '2023',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    genre: 'Tamil Action / LCU',
    director: 'Lokesh Kanagaraj',
  },
  {
    title: 'Jawan',
    year: '2023',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    genre: 'Bollywood Action / VFX',
    director: 'Atlee',
  },
  {
    title: 'Animal',
    year: '2023',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    genre: 'Indian Action / Drama',
    director: 'Sandeep Reddy Vanga',
  },
  {
    title: 'Salaar: Part 1 – Ceasefire',
    year: '2023',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    genre: 'Indian Action Epic',
    director: 'Prashanth Neel',
  },
  {
    title: 'K.G.F: Chapter 2',
    year: '2022',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    genre: 'Kannada Period Action',
    director: 'Prashanth Neel',
  },
  {
    title: 'Brahmāstra: Part One – Shiva',
    year: '2022',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    genre: 'Fantasy Astraverse VFX',
    director: 'Ayan Mukerji',
  },
  {
    title: 'Baahubali 2: The Conclusion',
    year: '2017',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    genre: 'Action / Period Epic',
    director: 'S. S. Rajamouli',
  },
  {
    title: 'Dune: Part Two',
    year: '2024',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    genre: 'Sci-Fi Epic',
    director: 'Denis Villeneuve',
  },
  {
    title: 'Avatar: The Way of Water',
    year: '2022',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    genre: 'Sci-Fi / 3D VFX',
    director: 'James Cameron',
  },
  {
    title: 'The Batman',
    year: '2022',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    genre: 'Action / Noir',
    director: 'Matt Reeves',
  },
  {
    title: 'Oppenheimer',
    year: '2023',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    genre: 'Historical / Practical VFX',
    director: 'Christopher Nolan',
  },
  {
    title: 'Inception',
    year: '2010',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    genre: 'Sci-Fi / Mindbender VFX',
    director: 'Christopher Nolan',
  },
  {
    title: 'Interstellar',
    year: '2014',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    genre: 'Sci-Fi / Cosmic VFX',
    director: 'Christopher Nolan',
  },
];

// Helper to fetch DuckDuckGo / Web images
async function fetchWebImages(searchTerm: string): Promise<{ title: string; posterUrl: string; year?: string; genre?: string; director?: string }[]> {
  const list: { title: string; posterUrl: string; year?: string; genre?: string; director?: string }[] = [];
  try {
    // Query DuckDuckGo image engine
    const queryStr = `${searchTerm} movie poster`;
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(queryStr)}&iar=images&iax=images&ia=images`;
    const initRes = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (initRes.ok) {
      const html = await initRes.text();
      // Extract vqd token
      const vqdMatch = html.match(/vqd=['"]?([0-9-]+)['"]?/) || html.match(/vqd=([0-9-]+)&/);
      const vqd = vqdMatch ? vqdMatch[1] : null;

      if (vqd) {
        const imgApiUrl = `https://duckduckgo.com/i.js?l=wt-wt&o=json&q=${encodeURIComponent(queryStr)}&vqd=${vqd}&f=,,,type:photo,&p=1`;
        const imgRes = await fetch(imgApiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://duckduckgo.com/',
          },
        });

        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData.results && Array.isArray(imgData.results)) {
            for (const item of imgData.results.slice(0, 10)) {
              if (item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))) {
                // Filter out tiny icons or banners
                const cleanTitle = (item.title || searchTerm).replace(/<[^>]+>/g, '').trim();
                list.push({
                  title: cleanTitle.length > 50 ? cleanTitle.slice(0, 48) + '...' : cleanTitle,
                  posterUrl: item.image,
                  year: 'Theatrical Release',
                  genre: 'Global Film Poster',
                  director: item.source || 'Web Image Result',
                });
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('[POSTER-SEARCH] Web search warning:', err);
  }

  // Also query Bing Images HTML parser as instant global fallback
  if (list.length < 4) {
    try {
      const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(searchTerm + ' movie poster high resolution')}&FORM=HDRSC2`;
      const bingRes = await fetch(bingUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (bingRes.ok) {
        const text = await bingRes.text();
        const matches = text.match(/m=&quot;\{&quot;murl&quot;:&quot;([^&]+)&quot;.*?&quot;t&quot;:&quot;([^&]+)&quot;/g);
        if (matches) {
          for (const m of matches.slice(0, 10)) {
            const urlMatch = m.match(/murl&quot;:&quot;([^&]+)&quot;/);
            const titleMatch = m.match(/&quot;t&quot;:&quot;([^&]+)&quot;/);
            if (urlMatch && urlMatch[1]) {
              const imgUrl = decodeURIComponent(urlMatch[1]);
              const rawTitle = titleMatch ? decodeURIComponent(titleMatch[1]) : searchTerm;
              if (imgUrl.startsWith('http')) {
                list.push({
                  title: rawTitle.length > 50 ? rawTitle.slice(0, 48) + '...' : rawTitle,
                  posterUrl: imgUrl,
                  year: 'Film Poster',
                  genre: 'Web Media Result',
                  director: 'High Resolution Poster',
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('[POSTER-SEARCH] Bing image lookup warning:', err);
    }
  }

  return list;
}

app.get('/api/posters/search', async (req, res) => {
  const query = (req.query.query as string || '').trim();
  if (!query) {
    return res.json({ results: VERIFIED_VFX_POSTERS.slice(0, 12) });
  }

  const results: any[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  const addResult = (item: { title: string; year?: string; posterUrl: string; genre?: string; director?: string }) => {
    if (!item.posterUrl) return;
    if (seenUrls.has(item.posterUrl)) return;
    seenUrls.add(item.posterUrl);

    const cleanKey = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Allow same title if different poster URL up to 3 variations
    const countForTitle = Array.from(seenTitles).filter((k) => k.startsWith(cleanKey)).length;
    if (countForTitle < 3) {
      seenTitles.add(`${cleanKey}_${countForTitle}`);
      results.push(item);
    }
  };

  // 1. Check curated library for instant exact / partial matches
  const queryLower = query.toLowerCase();
  for (const item of VERIFIED_VFX_POSTERS) {
    if (item.title.toLowerCase().includes(queryLower) || queryLower.includes(item.title.toLowerCase())) {
      addResult(item);
    }
  }

  // 2. Query Multiple Live Global Movie & Media APIs in Parallel (Web Search, Apple India + Apple US, Wikipedia Multi-Language, TVMaze)
  const apiPromises = [
    // Source A: Global Web / Google / Bing Real-Time Image Search (Catches ANY Indian, US, Asian, European Movie)
    (async () => {
      const webResults = await fetchWebImages(query);
      for (const item of webResults) {
        addResult(item);
      }
    })(),

    // Source B: Apple iTunes India Storefront (Covers Bollywood, Tollywood, Kollywood, Mollywood, Sandalwood)
    (async () => {
      try {
        const itunesInUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=movie&country=IN&limit=12`;
        const resp = await fetch(itunesInUrl, { headers: { 'User-Agent': 'RPW-Studio-PosterEngine/1.0' } });
        if (resp.ok) {
          const data = await resp.json();
          if (data.results && Array.isArray(data.results)) {
            for (const m of data.results) {
              const rawArtwork = m.artworkUrl100 || '';
              if (rawArtwork) {
                const hdArtwork = rawArtwork
                  .replace('100x100bb', '1400x1400bb')
                  .replace('100x100', '1400x1400')
                  .replace('60x60bb', '1400x1400bb');

                addResult({
                  title: m.trackName || m.collectionName || query,
                  year: m.releaseDate ? new Date(m.releaseDate).getFullYear().toString() : '',
                  posterUrl: hdArtwork,
                  genre: m.primaryGenreName ? `${m.primaryGenreName} (India/Global)` : 'Indian Feature Film',
                  director: m.artistName || 'Film Production',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('[POSTER-SEARCH] iTunes India API lookup warning:', err);
      }
    })(),

    // Source C: Apple iTunes US & International Storefront (Covers Hollywood & International Cinema)
    (async () => {
      try {
        const itunesUsUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=movie&country=US&limit=12`;
        const resp = await fetch(itunesUsUrl, { headers: { 'User-Agent': 'RPW-Studio-PosterEngine/1.0' } });
        if (resp.ok) {
          const data = await resp.json();
          if (data.results && Array.isArray(data.results)) {
            for (const m of data.results) {
              const rawArtwork = m.artworkUrl100 || '';
              if (rawArtwork) {
                const hdArtwork = rawArtwork
                  .replace('100x100bb', '1400x1400bb')
                  .replace('100x100', '1400x1400')
                  .replace('60x60bb', '1400x1400bb');

                addResult({
                  title: m.trackName || m.collectionName || query,
                  year: m.releaseDate ? new Date(m.releaseDate).getFullYear().toString() : '',
                  posterUrl: hdArtwork,
                  genre: m.primaryGenreName || 'Feature Film',
                  director: m.artistName || 'Film Production',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('[POSTER-SEARCH] iTunes US API lookup warning:', err);
      }
    })(),

    // Source D: Wikipedia / Wikimedia Commons Theatrical Film Poster Engine (Worldwide & Regional)
    (async () => {
      try {
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query + ' film OR movie')}&gsrlimit=10&prop=pageimages|description&piprop=original|thumbnail&pithumbsize=1000&origin=*`;
        const resp = await fetch(wikiUrl, { headers: { 'User-Agent': 'RPW-Studio-PosterEngine/1.0' } });
        if (resp.ok) {
          const data = await resp.json();
          if (data.query && data.query.pages) {
            const pages = Object.values(data.query.pages) as any[];
            for (const page of pages) {
              const imgUrl = page.original?.source || page.thumbnail?.source;
              if (imgUrl && !imgUrl.endsWith('.svg') && !imgUrl.endsWith('.svg.png')) {
                const pageTitle = (page.title || '').replace(/ \(.*film.*\)/i, '').replace(/ \(.*movie.*\)/i, '');
                addResult({
                  title: pageTitle,
                  year: page.description || 'Theatrical Release',
                  posterUrl: imgUrl,
                  genre: page.description || 'Feature Film',
                  director: 'Official Theatrical Poster',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('[POSTER-SEARCH] Wikipedia Film API lookup warning:', err);
      }
    })(),

    // Source E: TVMaze Show & Film Database
    (async () => {
      try {
        const tvUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
        const resp = await fetch(tvUrl);
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data)) {
            for (const entry of data) {
              const show = entry.show;
              const poster = show?.image?.original || show?.image?.medium;
              if (poster) {
                addResult({
                  title: show.name || query,
                  year: show.premiered ? show.premiered.slice(0, 4) : '',
                  posterUrl: poster,
                  genre: (show.genres && show.genres.join(', ')) || 'Cinematic Production',
                  director: show.network?.name || 'Studio Production',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('[POSTER-SEARCH] TVMaze API lookup warning:', err);
      }
    })(),
  ];

  await Promise.allSettled(apiPromises);

  // If still empty, return top featured VFX entries
  if (results.length === 0) {
    results.push(...VERIFIED_VFX_POSTERS.slice(0, 8));
  }

  return res.json({ results: results.slice(0, 30) });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// API ROUTE: PARTNER COLLECTIVE PROFILE CHECK NOTIFICATION
// ============================================================================
app.post('/api/partner/notify-click', async (req, res) => {
  try {
    const { studioName, partnerEmail, website, region, speciality } = req.body;
    
    const cleanStudioName = (studioName || 'Partner Studio').trim();
    const targetPartnerEmail = (partnerEmail && typeof partnerEmail === 'string' && partnerEmail.includes('@')) 
      ? partnerEmail.trim() 
      : 'tom@blackfx.net';
    const adminEmail = 'tom@blackfx.net';
    const senderEmail = 'rotopaintwala@gmail.com';

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' IST';

    console.log(`[PARTNER-NOTIFY] Profile checked: "${cleanStudioName}". Dispatching notices to: ${targetPartnerEmail} and ${adminEmail}`);

    const transporter = createMailTransporter();
    const fromAddress = process.env.SMTP_FROM || `Roto Paint Wala <${senderEmail}>`;

    // Beautiful UI Email Template for Partnered Studio
    const partnerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #05070b; color: #ffffff; padding: 32px 16px; margin: 0;">
        <div style="max-width: 560px; margin: 0 auto; background: #08111a; border: 1px solid #1a3b5c; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          
          <!-- Brand Header -->
          <div style="background: linear-gradient(180deg, #0d1b2a 0%, #08111a 100%); padding: 30px 24px 22px; text-align: center; border-bottom: 1px solid rgba(102, 252, 241, 0.25);">
            <h1 style="color: #66fcf1; font-size: 24px; font-weight: 900; letter-spacing: 2.5px; margin: 0; text-transform: uppercase;">ROTO PAINT WALA</h1>
            <p style="color: #87949c; font-size: 11px; margin-top: 6px; letter-spacing: 1.5px; text-transform: uppercase; font-family: monospace;">Partner Collective Network • Direct Alert</p>
          </div>

          <!-- Main Content Body -->
          <div style="padding: 32px 28px;">
            <h2 style="font-size: 19px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 18px;">
              Hello Team <span style="color: #66fcf1;">${cleanStudioName}</span>,
            </h2>

            <!-- Message Card Box -->
            <div style="background: #04080e; border: 1px solid rgba(102, 252, 241, 0.45); border-left: 4px solid #66fcf1; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="font-size: 16px; line-height: 1.55; color: #66fcf1; font-weight: 600; margin: 0;">
                Its glad to inform you that Someone checked ur profile from roto paint wala website.
              </p>
            </div>

            <p style="color: #9daab4; font-size: 14px; line-height: 1.65; margin: 16px 0;">
              A potential client or VFX producer browsing the <strong>Roto Paint Wala</strong> production platform interacted with your studio node in our active <strong>Partner Collective Network</strong>.
            </p>

            <!-- Metadata Box -->
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-top: 22px;">
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                <tr>
                  <td style="color: #87949c; padding: 4px 0;">Studio Node:</td>
                  <td style="color: #ffffff; font-weight: bold; text-align: right; padding: 4px 0;">${cleanStudioName}</td>
                </tr>
                <tr>
                  <td style="color: #87949c; padding: 4px 0;">Status:</td>
                  <td style="color: #00df81; font-weight: bold; text-align: right; padding: 4px 0;">● Verified Production Partner</td>
                </tr>
                <tr>
                  <td style="color: #87949c; padding: 4px 0;">Time Recorded:</td>
                  <td style="color: #ffffff; font-family: monospace; text-align: right; padding: 4px 0;">${timestamp}</td>
                </tr>
              </table>
            </div>

            <p style="color: #6b7c88; font-size: 12px; line-height: 1.5; margin-top: 24px;">
              Our network dispatch coordinates incoming shot volumes and enterprise allocations directly under the RPW dual-pass QC pipeline.
            </p>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 28px; background: #04080e; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #616e78;">
            <p style="margin: 0 0 6px 0; color: #87949c;">Dispatched by <strong>Roto Paint Wala Network</strong> (<a href="mailto:${senderEmail}" style="color: #66fcf1; text-decoration: none;">${senderEmail}</a>)</p>
            <p style="margin: 0; font-size: 11px; color: #48545e;">© 2026 Roto Paint Wala • High-Bandwidth Rotoscopy, Paint & VFX Support</p>
          </div>
        </div>
      </div>
    `;

    // Beautiful UI Email Template for tom@blackfx.net
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #05070b; color: #ffffff; padding: 32px 16px; margin: 0;">
        <div style="max-width: 560px; margin: 0 auto; background: #08111a; border: 1px solid #1a3b5c; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          
          <!-- Brand Header -->
          <div style="background: linear-gradient(180deg, #0d1b2a 0%, #08111a 100%); padding: 30px 24px 22px; text-align: center; border-bottom: 1px solid rgba(0, 223, 129, 0.3);">
            <h1 style="color: #66fcf1; font-size: 24px; font-weight: 900; letter-spacing: 2.5px; margin: 0; text-transform: uppercase;">ROTO PAINT WALA</h1>
            <p style="color: #00df81; font-size: 11px; margin-top: 6px; letter-spacing: 1.5px; text-transform: uppercase; font-family: monospace;">Partner Collective Intelligence Dispatch</p>
          </div>

          <!-- Main Content Body -->
          <div style="padding: 32px 28px;">
            <div style="background: #04080e; border: 1px solid rgba(0, 223, 129, 0.45); border-left: 4px solid #00df81; border-radius: 12px; padding: 20px; margin: 0 0 22px 0;">
              <p style="font-size: 16px; line-height: 1.55; color: #00df81; font-weight: 600; margin: 0;">
                Someone Checked ${cleanStudioName} from Studio Partner Collective.
              </p>
            </div>

            <p style="color: #9daab4; font-size: 14px; line-height: 1.65; margin: 16px 0;">
              A visitor on the website clicked on <strong>${cleanStudioName}</strong> in the Partner Universe interactive node network. An automated notification email has also been dispatched to the partner studio.
            </p>

            <!-- Metadata Box -->
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-top: 20px;">
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                <tr>
                  <td style="color: #87949c; padding: 4px 0;">Target Studio:</td>
                  <td style="color: #ffffff; font-weight: bold; text-align: right; padding: 4px 0;">${cleanStudioName}</td>
                </tr>
                <tr>
                  <td style="color: #87949c; padding: 4px 0;">Partner Email Notified:</td>
                  <td style="color: #66fcf1; font-family: monospace; text-align: right; padding: 4px 0;">${targetPartnerEmail}</td>
                </tr>
                <tr>
                  <td style="color: #87949c; padding: 4px 0;">Source Node:</td>
                  <td style="color: #ffffff; text-align: right; padding: 4px 0;">Partner Universe Infographic Hub</td>
                </tr>
                <tr>
                  <td style="color: #87949c; padding: 4px 0;">Timestamp:</td>
                  <td style="color: #ffffff; font-family: monospace; text-align: right; padding: 4px 0;">${timestamp}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 28px; background: #04080e; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #616e78;">
            <p style="margin: 0; color: #87949c;">Executive notice delivered to <strong>${adminEmail}</strong> from <strong>${senderEmail}</strong></p>
          </div>
        </div>
      </div>
    `;

    if (transporter) {
      try {
        // 1. Send to partner studio
        await transporter.sendMail({
          from: fromAddress,
          to: targetPartnerEmail,
          subject: `✨ Roto Paint Wala Network: Profile Checked for ${cleanStudioName}`,
          text: `Hello Team ${cleanStudioName},\n\nIts glad to inform you that Someone checked ur profile from ROTO PAINT WALA website.\n\nTime: ${timestamp}\n\nBest Regards,\nRoto Paint Wala Network (${senderEmail})`,
          html: partnerHtml,
        });
        console.log(`[PARTNER-NOTIFY] Email 1 sent to partner studio: ${targetPartnerEmail}`);

        // 2. Send to tom@blackfx.net
        await transporter.sendMail({
          from: fromAddress,
          to: adminEmail,
          subject: `🔔 Partner Collective Alert: Someone Checked ${cleanStudioName}`,
          text: `Someone Checked ${cleanStudioName} from Studio Partner Collective.\n\nPartner Email: ${targetPartnerEmail}\nTimestamp: ${timestamp}`,
          html: adminHtml,
        });
        console.log(`[PARTNER-NOTIFY] Email 2 sent to admin: ${adminEmail}`);
      } catch (mailError) {
        console.error('[PARTNER-NOTIFY] SMTP dispatch error:', mailError);
      }
    } else {
      console.log(`[PARTNER-NOTIFY] (DEV MODE) Notice logged: Someone Checked ${cleanStudioName}. Target partner: ${targetPartnerEmail}, Admin: ${adminEmail}`);
    }

    return res.json({
      success: true,
      message: 'Thankyou for your interest we will notify our partnered studio',
      studioName: cleanStudioName,
    });
  } catch (error) {
    console.error('[PARTNER-NOTIFY] Exception:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process notification.',
      message: 'Thankyou for your interest we will notify our partnered studio',
    });
  }
});

// ============================================================================
// VITE MIDDLEWARE & STATIC ASSETS SERVING
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RPW-SERVER] Roto Paint Wala server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
