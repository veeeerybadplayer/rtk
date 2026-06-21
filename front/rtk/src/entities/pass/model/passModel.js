// Pass entity - модель пропуска
export const passModel = {
  // Структура пропуска
  create: (data) => ({
    id: data.id,
    userId: data.user_id,
    qrCode: data.qr_code,
    generatedAt: data.generated_at,
    expiresAt: data.expires_at,
  }),
};
