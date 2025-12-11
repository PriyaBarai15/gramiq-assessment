import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AdvisoryBox({ advisories }) {
  const downloadPDF = async () => {
    const el = document.getElementById('advisory-box');
    const canvas = await html2canvas(el);
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p','mm','a4');
    const imgProps=pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('advisory.pdf');
  };

  return (
    <div id="advisory-box" className="advisory-box">
      <h3>Advisories</h3>
      {advisories.map((a,i)=>(
        <div key={i} className="advisory">
          <strong>{a.title}</strong>
          <p>{a.message}</p>
        </div>
      ))}
      <button onClick={downloadPDF}>Download advisory (PDF)</button>
    </div>
  )
}
