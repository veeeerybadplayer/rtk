// User entity - модель пользователя
export const userModel = {
  // Структура пользователя
  create: (data) => ({
    id: data.id,
    email: data.email,
    createdAt: data.created_at,
  }),
};
