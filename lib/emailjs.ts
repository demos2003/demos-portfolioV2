// EmailJS configuration shared by the contact form and Demi. These are public
// identifiers (EmailJS is called from the browser), not secrets. The template
// expects user_name, user_email and message.
export const EMAILJS = {
  serviceId: "service_a50v2vu",
  templateId: "template_ysj7cqg",
  publicKey: "VzuWI64-DSChqLogf",
}

// Marks an out-of-band event inside Demi's text stream (see app/api/demi).
export const DEMI_EVENT_MARK = "\u001e"
