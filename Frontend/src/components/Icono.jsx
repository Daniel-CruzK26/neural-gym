import React, { useEffect, useState } from 'react';
import "../styles/Meaning/Iconos.css"

const IconoSVG = ({ url, color }) => {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    console.log("URL que se va a cargar:", url);
    fetch(url)
      .then((res) => res.text())
      .then((svg) => {
        console.log("Contenido SVG:", svg);  // 👈 revisa si llega vacío
        setSvgContent(svg);
      });
  }, [url]);

  return (
    <div className="icono-container" style={{ color: color }}>
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
};

export default IconoSVG;