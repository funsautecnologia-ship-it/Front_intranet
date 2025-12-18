// Substituindo DOMNodeInserted por MutationObserver
export const observeDOM = (targetNode, callback) => {
  const config = { childList: true, subtree: true }; // Configuração para observar adição/remoção de nós

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        callback(mutation);
      }
    }
  });

  observer.observe(targetNode, config);

  return observer; // Retorna o observer para permitir desconexão posterior
};
