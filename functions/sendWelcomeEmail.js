const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// Set your SendGrid API Key in Firebase config or environment variable
sgMail.setApiKey(functions.config().sendgrid.key);

/**
 * Triggered when a new user is created in Firebase Auth
 * Sends a plain text welcome email using SendGrid
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
    const { email, displayName } = user;
    const name = displayName || 'Usuario';

    const msg = {
        to: email,
        from: 'hola@petplay.app', // Change to your verified sender
        subject: '¡Bienvenido a PetPlay! 🐾',
        text: `Hola ${name},\n\n¡Bienvenido a PetPlay! 🐾\nNos alegra muchísimo que formes parte de nuestra comunidad.\n\nPetPlay es un espacio creado para conectar perros y personas de manera segura, divertida y cercana. Aquí podrás:\n\n• Crear el perfil de tu perro\n• Descubrir perros cerca de tu zona\n• Hacer match con otros dueños\n• Ver alertas de perros perdidos en tu comunidad\n• Mantenerte conectado con lo que pasa alrededor de ti\n\nNuestro objetivo es simple: hacer que tu perro tenga más momentos felices y que tú tengas una comunidad en la que puedas confiar.\n\n👉 Empieza ahora completando el perfil de tu perro y descubre quién está cerca de ti.\n\nSi tienes cualquier duda, sugerencia o comentario, puedes responder directamente a este correo. Estamos construyendo PetPlay contigo y para ti.\n\nGracias por confiar en nosotros.\n\nCon cariño,\nEl equipo de PetPlay`,
    };

    try {
        await sgMail.send(msg);
        console.log('Welcome email sent to', email);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
});
