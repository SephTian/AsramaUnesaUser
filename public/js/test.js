document.getElementById("downloadBtn").addEventListener("click", () => {
  // html2canvas(document.querySelector("#content")).then((canvas) => {
  //   let base64image = canvas.toDataURL("image/png");

  //   let pdf = new jsPDF("p", "px", [1600, 1131]);
  //   pdf.addImage(base64image, "PNG", 15, 15);
  //   pdf.save("output.pdf");
  // });
  const content = document.getElementById("content");

  html2pdf(content, {
    margin: 10,
    filename: "test.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  });
  // // Initialize jsPDF
  // const pdf = new jsPDF();

  // // Add content to PDF
  // pdf.fromHTML(content, 15, 15);

  // // Download the PDF
  // pdf.save("output.pdf");
});
