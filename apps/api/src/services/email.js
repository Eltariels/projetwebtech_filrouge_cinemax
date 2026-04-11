import nodemailer from "nodemailer";

// Crée le transporteur SMTP à partir des variables d'environnement
// Si SMTP n'est pas configuré, les emails sont juste loggés (dev mode)
const createTransporter = () => {
    if (!process.env.SMTP_HOST) {
        console.warn("[Email] SMTP non configuré — les emails seront loggés uniquement.");
        return null;
    }
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === "465",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
};

const transporter = createTransporter();
const FROM = process.env.SMTP_FROM || "Cinemax <noreply@cinemax.app>";
const APP_URL = process.env.APP_URL || "http://localhost:5173";

// Envoi générique avec fallback console
async function send(to, subject, html) {
    if (!transporter) {
        console.log(`[Email dev] To: ${to} | Subject: ${subject}`);
        return;
    }
    await transporter.sendMail({ from: FROM, to, subject, html });
}

// ─── Templates ────────────────────────────────────────────────────────────────

const baseStyle = `
  font-family: 'Georgia', serif;
  background: #0a0a0a;
  color: #e8e0d0;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 32px;
  border-radius: 8px;
`;

const gold = "#c9a84c";

function layout(content) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head><body style="background:#0a0a0a;margin:0;padding:20px;">
    <div style="${baseStyle}">
      <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid rgba(201,168,76,0.3);">
        <h1 style="font-family:'Georgia',serif;font-size:2rem;color:${gold};letter-spacing:0.3em;font-weight:300;margin:0;">
          CINEMAX
        </h1>
        <p style="color:#7a7060;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;margin:6px 0 0;">
          Votre univers cinématographique
        </p>
      </div>
      ${content}
      <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid rgba(201,168,76,0.15);color:#7a7060;font-size:0.75rem;">
        <p>© Cinemax — <a href="${APP_URL}" style="color:${gold};">Ouvrir l'app</a></p>
      </div>
    </div></body></html>`;
}

function welcomeTemplate(username) {
    return layout(`
      <h2 style="font-family:'Georgia',serif;font-weight:300;color:#e8e0d0;font-size:1.6rem;margin-bottom:8px;">
        Bienvenue, <span style="color:${gold};">${username}</span> 🎬
      </h2>
      <p style="color:#b0a090;line-height:1.7;margin-bottom:24px;">
        Ton compte Cinemax est prêt. Explore des milliers de films et séries, construis ta watchlist et découvre ton ADN Cinéma.
      </p>
      <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:20px;margin-bottom:28px;">
        <p style="color:${gold};font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px;">Par où commencer ?</p>
        <ul style="color:#b0a090;line-height:2;margin:0;padding-left:20px;font-size:0.9rem;">
          <li>Complète ton <strong style="color:#e8e0d0;">ADN Cinéma</strong> pour des recommandations personnalisées</li>
          <li>Parcours les <strong style="color:#e8e0d0;">tendances</strong> de la semaine</li>
          <li>Ajoute des films à ta <strong style="color:#e8e0d0;">Watchlist</strong></li>
        </ul>
      </div>
      <div style="text-align:center;">
        <a href="${APP_URL}/preferences" style="background:linear-gradient(135deg,#a07830,${gold});color:#0a0a0a;font-weight:600;padding:14px 32px;border-radius:4px;text-decoration:none;font-size:0.9rem;display:inline-block;letter-spacing:0.05em;">
          Configurer mon profil →
        </a>
      </div>
    `);
}

function resetPasswordTemplate(resetUrl) {
    return layout(`
      <h2 style="font-family:'Georgia',serif;font-weight:300;color:#e8e0d0;font-size:1.6rem;margin-bottom:8px;">
        Réinitialisation du mot de passe
      </h2>
      <p style="color:#b0a090;line-height:1.7;margin-bottom:24px;">
        Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous — ce lien expire dans <strong style="color:#e8e0d0;">1 heure</strong>.
      </p>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${resetUrl}" style="background:linear-gradient(135deg,#a07830,${gold});color:#0a0a0a;font-weight:600;padding:14px 32px;border-radius:4px;text-decoration:none;font-size:0.9rem;display:inline-block;letter-spacing:0.05em;">
          Réinitialiser mon mot de passe →
        </a>
      </div>
      <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:16px;">
        <p style="color:#7a7060;font-size:0.8rem;margin:0;line-height:1.6;">
          Si tu n'as pas demandé cette réinitialisation, ignore cet email. Ton mot de passe reste inchangé.
        </p>
      </div>
    `);
}

function weeklyNewsletterTemplate(username, movies) {
    const cards = movies.slice(0, 6).map(m => `
      <a href="${APP_URL}/movie/${m.id}" style="text-decoration:none;display:block;margin-bottom:16px;border:1px solid rgba(201,168,76,0.15);border-radius:6px;overflow:hidden;background:rgba(255,255,255,0.02);">
        <div style="display:flex;gap:12px;padding:12px;align-items:center;">
          ${m.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w92${m.poster_path}" alt="${m.title || m.name}" style="width:50px;height:75px;object-fit:cover;border-radius:3px;flex-shrink:0;">`
            : `<div style="width:50px;height:75px;background:rgba(201,168,76,0.1);border-radius:3px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${gold};font-size:1.2rem;">${(m.title || m.name || "?")[0]}</div>`
          }
          <div>
            <p style="color:#e8e0d0;font-weight:600;margin:0 0 4px;font-size:0.9rem;">${m.title || m.name}</p>
            <p style="color:${gold};margin:0 0 4px;font-size:0.8rem;">★ ${(m.vote_average || 0).toFixed(1)}</p>
            <p style="color:#7a7060;margin:0;font-size:0.75rem;">${(m.overview || "").slice(0, 80)}${m.overview?.length > 80 ? "..." : ""}</p>
          </div>
        </div>
      </a>
    `).join("");

    return layout(`
      <h2 style="font-family:'Georgia',serif;font-weight:300;color:#e8e0d0;font-size:1.6rem;margin-bottom:4px;">
        Salut <span style="color:${gold};">${username}</span> 👋
      </h2>
      <p style="color:#7a7060;font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px;">
        Sélection de la semaine
      </p>
      <p style="color:#b0a090;line-height:1.7;margin-bottom:24px;">
        Voici les films qui font parler cette semaine sur Cinemax. Bonne séance !
      </p>
      ${cards}
      <div style="text-align:center;margin-top:24px;">
        <a href="${APP_URL}" style="background:linear-gradient(135deg,#a07830,${gold});color:#0a0a0a;font-weight:600;padding:14px 32px;border-radius:4px;text-decoration:none;font-size:0.9rem;display:inline-block;">
          Voir toutes les tendances →
        </a>
      </div>
    `);
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const sendWelcomeEmail = (to, username) =>
    send(to, "Bienvenue sur Cinemax 🎬", welcomeTemplate(username));

export const sendResetPasswordEmail = (to, resetUrl) =>
    send(to, "Réinitialisation de votre mot de passe — Cinemax", resetPasswordTemplate(resetUrl));

export const sendWeeklyNewsletter = (to, username, movies) =>
    send(to, "🎬 Les tendances Cinemax de la semaine", weeklyNewsletterTemplate(username, movies));
