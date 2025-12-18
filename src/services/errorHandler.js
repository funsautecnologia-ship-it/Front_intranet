import { notify } from '../utils/notificationService'; // Novo serviço de notificação
import i18n from '../utils/i18n'; // Suporte para internacionalização

export const handleError = (error) => {
  console.error('Erro:', error);
  if (error.response) {
    notify.error(i18n.t(error.response.data.message || 'server.error'));
  } else {
    notify.error(i18n.t('unknown.error'));
  }
};
