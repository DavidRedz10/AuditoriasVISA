
var today = new Date();

// Obtener los componentes de la fecha
var year = today.getFullYear();
var month = (today.getMonth() + 1).toString().padStart(2, '0'); // Los meses son indexados desde 0
var day = today.getDate().toString().padStart(2, '0');

var formattedDate = `${year}-${month}-${day}`;


function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
window.generate = function generate() {
  const ptlfValue = document.getElementById("ptlfInput").value;
  const nameValue = document.getElementById("nameInput").value;
  const title1Value = document.getElementById("title1Input").value;
  const Input1Value = document.getElementById("Input1Input").value;
  const Input2Value = document.getElementById("Input2Input").value;
  const title2Value = document.getElementById("title2Input").value;
  const Input3Value = document.getElementById("Input3Input").value;
  const Input4Value = document.getElementById("Input4Input").value;



  loadFile(
    "https://docs.google.com/document/d/1yW7oodVfkG4epuOb8jrd1WONuej2zVyJ/export?format=docx",
    function (error, content) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new window.docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
      doc.render({
        name: nameValue,
        PTLF: ptlfValue,
        title1: title1Value,
        input1: Input1Value,
        input2: Input2Value,
        title2: title2Value,
        input3: Input3Value,
        input4: Input4Value,
      });

      const blob = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
      });
      // Output the document using Data-URI
      saveAs(blob, "Auditoria " + nameValue + " / " + formattedDate + ".docx");
    }
  );


};

function cleanInputs() {
  document.getElementById("ptlfInput").value = "";
  document.getElementById("nameInput").value = "";
  document.getElementById("Input1Input").value = "";
  document.getElementById("Input2Input").value = "";
  document.getElementById("Input3Input").value = "";
  document.getElementById("Input4Input").value = "";
}


var sectionCount = 0; // Contador para hacer un seguimiento del número de secciones agregadas

function addSection() {
  sectionCount++; // Incrementa el contador de secciones

  // Crea un nuevo div con la clase "card" y su contenido
  var newSection = document.createElement("h3");
  newSection.className = "NuevaSec";
  newSection.innerHTML = `
<div class="card">
    <h3 style="color:#2B68DB" >Titulo de la transaccion ${sectionCount + 1}</h3>
    <textarea id="nameInput" spellcheck="false" placeholder="Nombre de la transaccion" class="input" name="firstName"  ></textarea> 
  </div>

  <div class="card">
    <h3>PLTF</h3>
    <textarea id="ptlfInput"  spellcheck="false" placeholder="PTLF" class="input" name="firstName" oninput="autoResize(this)"></textarea> 
  </div>
    
  <div class="card">
    <div class="lado">
    <h3>Auditoria</h3>
    <input spellcheck="false" class="titulo" id="title1Input"></input>
  </div>
    <textarea id="Input1Input" spellcheck="false" placeholder="Campo 1" class="input" name="firstName" oninput="autoResize(this)"></textarea> 
    <textarea id="Input2Input" spellcheck="false" placeholder="Campo 2" class="input" name="Input1" oninput="autoResize(this)"></textarea> 
  </div>

  <div class="card">
    <div class="lado">
      <h3>Auditoria</h3>
      <input spellcheck="false" class="titulo" id="title2Input" ></input>
    </div>
    <textarea id="Input3Input" spellcheck="false" placeholder="Campo 1" class="input" name="firstName" oninput="autoResize(this)"></textarea> 
    <textarea id="Input4Input" spellcheck="false" placeholder="Campo 2" class="input" name="firstName" oninput="autoResize(this)"></textarea>  
  </div>
`;

  // Agrega la nueva sección al documento
  document.body.appendChild(newSection);

  // Asegúrate de que el nuevo textarea se pueda redimensionar automáticamente
  autoResize(newSection.querySelector(`#nameInput${sectionCount}`));
}
