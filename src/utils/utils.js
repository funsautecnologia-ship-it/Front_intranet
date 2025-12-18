// Remove tags HTML e limita o tamanho do texto
export function truncate(text, len) {
  if (!text) return '';
  const clean = text.replace(/<[^>]+>/g, '');
  return clean.length > len ? clean.slice(0, len) + '...' : clean;
}

// Formata datas no padrão "12 de Maio"
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${d.getDate()} de ${meses[d.getMonth()]}`;
}