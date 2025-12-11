import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (to, type, username, field = '', code = '') => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let subject = '';
    let html = '';

    if (type === 'register') {
        subject = '¡Bienvenido a nuestro eCommerce!';
        html = `
        <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #ddd;">
            <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1>¡Bienvenido, ${username}!</h1>
            </div>
            <div style="padding: 20px; color: #333;">
              <p>¡Tu registro en eCommerce fue exitoso!.</p>
              <p>Estamos felices de tenerte con nosotros.</p>
              <p>Te enviaremos novedades sobre nuestro sitio.</p>
              <a href="http://localhost:5173/" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Ir al sitio</a>
            </div>
            <div style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #777;">
              &copy; 2025 eCommerce. Todos los derechos reservados.
            </div>
          </div>
        </div>
        `;
    }

    if (type === 'login') {
        subject = 'Inicio de sesión exitoso';
        html = `
        <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #ddd;">
            <div style="background: #2196F3; color: white; padding: 20px; text-align: center;">
              <h1>¡Has iniciado sesión, ${username}!</h1>
            </div>
            <div style="padding: 20px; color: #333;">
              <p>Se detectó un inicio de sesión en tu cuenta.</p>
              <p>Si fuiste tú, puedes ignorar este mensaje.</p>
              <p>En caso de que no hayas sido tú te recomendamos que cambies tu contraseña de inmediato.</p>
              <a href="http://localhost:5173/" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px;">Ir al sitio</a>
            </div>
            <div style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #777;">
              &copy; 2025 eCommerce. Todos los derechos reservados.
            </div>
          </div>
        </div>
        `;
    }

    if (type === 'verification') {
        const fieldLabel = field === 'email' ? 'correo electrónico' : 'contraseña';
        subject = `Código de verificación para cambiar ${fieldLabel}`;
        html = `
        <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #ddd;">
            <div style="background: #FF9800; color: white; padding: 20px; text-align: center;">
              <h1>Código de Verificación</h1>
            </div>
            <div style="padding: 20px; color: #333;">
              <p>Hola ${username},</p>
              <p>Has solicitado cambiar tu ${fieldLabel}.</p>
              <p style="font-size: 18px; font-weight: bold; color: #333;">Tu código de verificación es:</p>
              <div style="background: #f1f1f1; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center;">
                <p style="font-size: 32px; font-weight: bold; color: #FF9800; margin: 0; letter-spacing: 5px;">${code}</p>
              </div>
              <p style="color: #FF9800; font-weight: bold;">⏰ Este código expira en 10 minutos</p>
              <p>Si no solicitaste este cambio, ignora este correo.</p>
            </div>
            <div style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #777;">
              &copy; 2025 eCommerce. Todos los derechos reservados.
            </div>
          </div>
        </div>
        `;
    }

    if (type === 'delete_account') {
        subject = '⚠️ Código de seguridad para eliminar cuenta';
        html = `
        <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #ddd;">
            <div style="background: #f44336; color: white; padding: 20px; text-align: center;">
              <h1>⚠️ Solicitud de Eliminación de Cuenta</h1>
            </div>
            <div style="padding: 20px; color: #333;">
              <p>Hola ${username},</p>
              <p style="color: #f44336; font-weight: bold;">Se ha solicitado la eliminación de tu cuenta.</p>
              <p>Tu código de seguridad es:</p>
              <div style="background: #f1f1f1; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center;">
                <p style="font-size: 32px; font-weight: bold; color: #f44336; margin: 0; letter-spacing: 5px;">${code}</p>
              </div>
              <p style="color: #f44336; font-weight: bold;">⏰ Este código expira en 10 minutos</p>
              <p><strong>Importante:</strong> Esta acción es irreversible. Si procedes, todos tus datos serán eliminados permanentemente.</p>
              <p>Si no solicitaste esto, <strong>no compartas el código</strong> y tu cuenta seguirá siendo segura.</p>
            </div>
            <div style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #777;">
              &copy; 2025 eCommerce. Todos los derechos reservados.
            </div>
          </div>
        </div>
        `;
    }

    await transporter.sendMail({
        from: `"eCommerce" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });

    console.log(`🚀 Email enviado a: ${to} (tipo: ${type})`);
};