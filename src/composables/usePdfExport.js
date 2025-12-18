// composables/usePdfExport.js
import jsPDF from 'jspdf';

export const usePdfExport = () => {
  const exportTableToPDF = (options) => {
    const {
      title,
      subtitle,
      headers,
      data,
      fileName = 'document',
      orientation = 'portrait',
      unit = 'mm',
      format = 'a4',
      styles = {},
      columnWidths
    } = options;

    try {
      const doc = new jsPDF({
        orientation,
        unit,
        format
      });

      // Configurações padrão - CORRIGIDO
      const defaultStyles = {
        title: { 
          fontSize: 18, 
          fontStyle: 'bold', 
          color: [25, 118, 210] 
        },
        subtitle: { 
          fontSize: 12, 
          fontStyle: 'normal', 
          color: [100, 100, 100] 
        },
        header: { 
          fillColor: [25, 118, 210], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          fontSize: 11
        },
        body: { 
          fontSize: 10, 
          textColor: [0, 0, 0], 
          fontStyle: 'normal' 
        },
        footer: { 
          fontSize: 8, 
          textColor: [150, 150, 150] 
        }
      };

      // Mesclar estilos personalizados - CORRIGIDO
      const mergedStyles = {
        title: { ...defaultStyles.title, ...styles.title },
        subtitle: { ...defaultStyles.subtitle, ...styles.subtitle },
        header: { ...defaultStyles.header, ...styles.header },
        body: { ...defaultStyles.body, ...styles.body },
        footer: { ...defaultStyles.footer, ...styles.footer }
      };

      let y = 20;
      const margin = 14;
      const pageWidth = doc.internal.pageSize.width;
      const contentWidth = pageWidth - (margin * 2);
      const columnCount = headers.length;
      let widths = [];
      if (Array.isArray(columnWidths) && columnWidths.length === columnCount) {
        const sum = columnWidths.reduce((a, b) => a + b, 0);
        if (sum > 0 && sum <= 1.01) {
          widths = columnWidths.map(r => r * contentWidth);
        } else {
          widths = columnWidths;
        }
      } else {
        const w = contentWidth / columnCount;
        widths = Array(columnCount).fill(w);
      }
      const cumulativeX = (index) => {
        let acc = 0;
        for (let i = 0; i < index; i++) acc += widths[i];
        return margin + acc;
      };

      const fitTextToWidth = (text, width) => {
        const limit = Math.max(0, width - 8);
        let t = String(text ?? '');
        if (doc.getTextWidth(t) <= limit) return t;
        while (t.length > 0 && doc.getTextWidth(t + '...') > limit) {
          t = t.slice(0, -1);
        }
        return t + '...';
      };

      // Adicionar título - CORRIGIDO
      if (title) {
        doc.setFontSize(mergedStyles.title.fontSize);
        doc.setFont('helvetica', mergedStyles.title.fontStyle);
        doc.setTextColor(...mergedStyles.title.color);
        doc.text(title, margin, y);
        y += 8;
      }

      // Adicionar subtítulo - CORRIGIDO
      if (subtitle) {
        doc.setFontSize(mergedStyles.subtitle.fontSize);
        doc.setFont('helvetica', mergedStyles.subtitle.fontStyle);
        doc.setTextColor(...mergedStyles.subtitle.color);
        doc.text(subtitle, margin, y);
        y += 10;
      }

      // Adicionar cabeçalhos da tabela - CORRIGIDO
      if (headers && headers.length > 0) {
        doc.setFontSize(mergedStyles.header.fontSize);
        doc.setFont('helvetica', mergedStyles.header.fontStyle);
        doc.setTextColor(...mergedStyles.header.textColor);
        
        // Desenhar fundo dos cabeçalhos
        doc.setFillColor(...mergedStyles.header.fillColor);
        doc.rect(margin, y, contentWidth, 8, 'F');
        
        // Adicionar texto dos cabeçalhos
        headers.forEach((header, index) => {
          const x = cumulativeX(index);
          const txt = fitTextToWidth(header, widths[index]);
          doc.text(txt, x + 4, y + 5);
        });
        
        y += 10;
      }

      // Adicionar dados da tabela - CORRIGIDO
      if (data && data.length > 0) {
        doc.setFontSize(mergedStyles.body.fontSize);
        doc.setFont('helvetica', mergedStyles.body.fontStyle);
        doc.setTextColor(...mergedStyles.body.textColor);
        
        data.forEach((row, rowIndex) => {
          // Verificar se precisa de nova página
          if (y > doc.internal.pageSize.height - 20) {
            addFooter(doc, mergedStyles.footer);
            doc.addPage();
            y = 20;
            
            // Redesenhar cabeçalhos em nova página
            if (headers && headers.length > 0) {
              doc.setFontSize(mergedStyles.header.fontSize);
              doc.setFont('helvetica', mergedStyles.header.fontStyle);
              doc.setTextColor(...mergedStyles.header.textColor);
              doc.setFillColor(...mergedStyles.header.fillColor);
              doc.rect(margin, y, contentWidth, 8, 'F');
              
              headers.forEach((header, index) => {
                const x = cumulativeX(index);
                const txt = fitTextToWidth(header, widths[index]);
                doc.text(txt, x + 4, y + 5);
              });
              
              y += 10;
              doc.setFont('helvetica', mergedStyles.body.fontStyle);
              doc.setTextColor(...mergedStyles.body.textColor);
            }
          }
          
          // Alternar cores das linhas para melhor legibilidade
          if (rowIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, y - 2, contentWidth, 8, 'F');
          }
          
          // Adicionar dados da linha
          row.forEach((cell, cellIndex) => {
            const x = cumulativeX(cellIndex);
            const txt = fitTextToWidth(cell, widths[cellIndex]);
            doc.text(txt, x + 4, y + 5);
          });
          
          y += 8;
        });
        
        // Adicionar total de registros
        y += 6;
        doc.setFontSize(mergedStyles.footer.fontSize);
        doc.setTextColor(...mergedStyles.footer.textColor);
        doc.text(`Total de registros: ${data.length}`, margin, y);
      } else {
        // Mensagem para dados vazios
        doc.setFontSize(12);
        doc.setTextColor(150, 150, 150);
        doc.text('Nenhum dado para exibir', margin, y);
      }

      // Adicionar rodapé em todas as páginas
      addFooter(doc, mergedStyles.footer);

      // Salvar PDF
      const safeFileName = fileName.replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`${safeFileName}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Falha ao gerar PDF: ' + error.message);
    }
  };

  const exportDetailsToPDF = (options) => {
    const {
      title,
      subtitle,
      items,
      fields,
      fileName = 'document',
      orientation = 'portrait',
      unit = 'mm',
      format = 'a4',
      styles = {}
    } = options;

    try {
      const doc = new jsPDF({ orientation, unit, format });

      const defaultStyles = {
        title: { fontSize: 18, fontStyle: 'bold', color: [25, 118, 210] },
        subtitle: { fontSize: 12, fontStyle: 'normal', color: [100, 100, 100] },
        header: { fontSize: 11, fontStyle: 'bold', textColor: [0, 0, 0] },
        body: { fontSize: 10, fontStyle: 'normal', textColor: [0, 0, 0] },
        separator: { color: [220, 220, 220] },
        footer: { fontSize: 8, textColor: [150, 150, 150] }
      };

      const merged = {
        title: { ...defaultStyles.title, ...styles.title },
        subtitle: { ...defaultStyles.subtitle, ...styles.subtitle },
        header: { ...defaultStyles.header, ...styles.header },
        body: { ...defaultStyles.body, ...styles.body },
        separator: { ...defaultStyles.separator, ...styles.separator },
        footer: { ...defaultStyles.footer, ...styles.footer }
      };

      const margin = 14;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      const writeText = (text, style) => {
        doc.setFontSize(style.fontSize);
        doc.setFont('helvetica', style.fontStyle);
        if (style.textColor) doc.setTextColor(...style.textColor);
        const lines = doc.splitTextToSize(String(text ?? ''), contentWidth);
        lines.forEach(line => {
          if (y > pageHeight - 20) {
            addFooter(doc, merged.footer);
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += 6;
        });
      };

      if (title) {
        writeText(title, merged.title);
        y += 2;
      }
      if (subtitle) {
        writeText(subtitle, merged.subtitle);
        y += 2;
      }

      items.forEach((item, idx) => {
        fields.forEach(f => {
          const value = f.getter ? f.getter(item) : item[f.key];
          writeText(`${f.label}: ${value ?? '-'}`, merged.body);
        });
        if (idx < items.length - 1) {
          if (y > pageHeight - 20) {
            addFooter(doc, merged.footer);
            doc.addPage();
            y = 20;
          }
          doc.setDrawColor(...merged.separator.color);
          doc.line(margin, y, margin + contentWidth, y);
          y += 8;
        }
      });

      addFooter(doc, merged.footer);
      const safeFileName = fileName.replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`${safeFileName}_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Falha ao gerar PDF: ' + error.message);
    }
  };

  // Função auxiliar para adicionar rodapé
  const addFooter = (doc, footerStyles) => {
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(footerStyles.fontSize);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...footerStyles.textColor);
      
      doc.text(
        `Gerado em: ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  };

  return {
    exportTableToPDF,
    exportDetailsToPDF
  };
};
