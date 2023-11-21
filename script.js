


//Crear objeto para docxtemplater
function createSectionObject(
  name,
  ptlf,
  title1,
  input1,
  input2,
  title2,
  input3,
  input4
) {
  return {
    name: name,
    ptlf: ptlf,
    title1: title1,
    input1: input1,
    input2: input2,
    title2: title2,
    input3: input3,
    input4: input4,
  };
}
//____________________________________________________________

//Obtener los componentes de la fecha
var today = new Date();
var year = today.getFullYear();
var month = (today.getMonth() + 1).toString().padStart(2, "0");
var day = today.getDate().toString().padStart(2, "0");
var formattedDate = `${year}-${month}-${day}`;
//____________________________________________________________

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

var downloadedFiles = [];

function updateDownloadHistory(filename) {
  downloadedFiles.push(filename);
  showDownloadHistory();
}

function showDownloadHistory() {
  var sidebar = document.querySelector(".sidebar");
  var downloadHistoryContainer = sidebar.querySelector(
    ".download-history-container"
  );
  var downloadHistory = document.createElement("div");
  downloadHistory.className = "download-history";

  if (downloadedFiles.length === 0) {
    downloadHistory.innerHTML +=
      '<p style="color: white;">Ningún archivo descargado aún.</p>';
  } else {
    for (var i = 0; i < downloadedFiles.length; i++) {
      (function (index) {
        var downloadLink = document.createElement("a");
        downloadLink.style.color = "white";
        downloadLink.textContent = downloadedFiles[index];
        downloadLink.href = "javascript:void(0);";
        downloadLink.onclick = function () {
          downloadFile(downloadedFiles[index]);
        };

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.className = "delete-button";
        deleteButton.style.backgroundColor = "#1C00ff00";
        deleteButton.style.color = "#d9534f";
        deleteButton.style.border = "none";
        deleteButton.style.float = "right";
        deleteButton.querySelector("i").style.fontSize = "20px";

        deleteButton.onclick = function () {
          deleteFile(downloadedFiles[index]);
        };

        downloadHistory.appendChild(downloadLink);
        downloadHistory.appendChild(deleteButton);
        downloadHistory.appendChild(document.createElement("br"));
      })(i);
    }
  }

  var existingDownloadHistory =
    downloadHistoryContainer.querySelector(".download-history");
  if (existingDownloadHistory) {
    existingDownloadHistory.remove();
  }

  downloadHistoryContainer.appendChild(downloadHistory);
}

window.generate = function generate() {
  if (sectionCount < 1) {
    alert("Debes agregar al menos una sección antes de generar el documento.");
    return;
  }

  const sections = [];

  for (var i = 1; i <= sectionCount; i++) {
    const nameValue = document.getElementById(`nameInput${i}`).value;
    const ptlfValue = document.getElementById(`ptlf${i}`).value;
    const title1Value = document.getElementById(`title1${i}`).value;
    const Input1Value = document.getElementById(`Input1${i}`).value;
    const Input2Value = document.getElementById(`Input2${i}`).value;
    const title2Value = document.getElementById(`title2${i}`).value;
    const Input3Value = document.getElementById(`Input3${i}`).value;
    const Input4Value = document.getElementById(`Input4${i}`).value;
    const section = createSectionObject(
      nameValue,
      ptlfValue,
      title1Value,
      Input1Value,
      Input2Value,
      title2Value,
      Input3Value,
      Input4Value
    );
    sections.push(section);

    // Crear objeto con los valores
    const sectionData = {
      name: nameValue,
      ptlf: ptlfValue,
      title1: title1Value,
      input1: Input1Value,
      input2: Input2Value,
      title2: title2Value,
      input3: Input3Value,
      input4: Input4Value,
    };
  }

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

      var renderedSections = [];

      sections.forEach(function (section) {
        var renderedSection = {
          name: section.name,
          PTLF: section.ptlf,
          title1: section.title1,
          input1: section.input1,
          input2: section.input2,
          title2: section.title2,
          input3: section.input3,
          input4: section.input4,
        };
        renderedSections.push(renderedSection);
      });

      doc.render({
        Section: renderedSections,
      });

      const blob = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        compression: "DEFLATE",
      });

      // Configurar AWS SDK
      AWS.config.update({
        accessKeyId: "AKIA4S4JXO76SPL4VHTS ",
        secretAccessKey: "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",
        region: "us-east-1",
      });

      // Crear el objeto S3
      var s3 = new AWS.S3();

      var generatedFileName =
        "Auditoria " + sections[0].name + " - " + formattedDate + ".docx";

      // Crear el objeto de parámetros para la carga del archivo
      var params = {
        Bucket: "auditflow",
        Key: generatedFileName,
        Body: blob,
        ContentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // No incluir ACL para utilizar la configuración predeterminada del bucket
      };

      saveAs(blob, generatedFileName);

      // Subir el archivo a S3
      s3.upload(params, function (err, data) {
        if (err) {
          console.error("Error al subir el archivo a S3: ", err);
        } else {
          console.log("Archivo subido exitosamente a S3: ", data);
          updateDownloadHistory(generatedFileName);
        }
      });
    }
  );
};

function cleanInputs() {
  for (var i = 1; i <= sectionCount; i++) {
    document.getElementById(`ptlf${i}`).value = "";
    document.getElementById(`nameInput${i}`).value = "";
    document.getElementById(`Input1${i}`).value = "";
    document.getElementById(`Input2${i}`).value = "";
    document.getElementById(`Input3${i}`).value = "";
    document.getElementById(`Input4${i}`).value = "";
  }
}

var sectionCount = 0;

function addSection() {
  sectionCount++;

  var newSection = document.createElement("h3");
  newSection.className = "NuevaSec";
  newSection.innerHTML = `
      <div class="card" id="sectionContainer">
          <h3  style="color:#2B68DB">Titulo de la transaccion ${sectionCount}</h3>
          <textarea id="nameInput${sectionCount}" spellcheck="false" placeholder="Nombre de la transaccion" class="input" name="firstName"  ></textarea> 
      </div>

      <div class="card">
          <h3>PLTF</h3>
          <textarea id="ptlf${sectionCount}"  spellcheck="false" placeholder="PTLF" class="input" name="firstName" oninput="autoResize(this)"></textarea> 
      </div>
          
      <div class="card">
          <div class="lado">
          <h3>Auditoria</h3>
          <input spellcheck="false" class="titulo" id="title1${sectionCount}"></input>
      </div>
          <textarea id="Input1${sectionCount}" spellcheck="false" placeholder="Campo 1" class="input" name="firstName" oninput="autoResize(this)"></textarea> 
          <textarea id="Input2${sectionCount}" spellcheck="false" placeholder="Campo 2" class="input" name="Input1" oninput="autoResize(this)"></textarea> 
      </div>

      <div class="card">
          <div class="lado">
          <h3>Auditoria</h3>
          <input spellcheck="false" class="titulo" id="title2${sectionCount}" ></input>
          </div>
          <textarea id="Input3${sectionCount}" spellcheck="false" placeholder="Campo 1" class="input" name="firstName" oninput="autoResize(this)"></textarea> 
          <textarea id="Input4${sectionCount}" spellcheck="false" placeholder="Campo 2" class="input" name="firstName" oninput="autoResize(this)"></textarea>  
      </div>
    `;

  document.body.appendChild(newSection);
}

function eliminarElementosPorClase() {
  const elementosEliminar = document.querySelectorAll("." + "NuevaSec");

  elementosEliminar.forEach(function (elemento) {
    elemento.remove();
  });

  sectionCount = 0;
}

window.onload = function () {
  showDownloadHistory();
};

function removeFileFromHistory(filename) {
  var index = downloadedFiles.indexOf(filename);
  if (index !== -1) {
    downloadedFiles.splice(index, 1);
    showDownloadHistory(); // Actualizar el historial después de la eliminación
  }
}

function deleteFile(filename) {
  // Configurar AWS SDK
  AWS.config.update({
    accessKeyId: "AKIA4S4JXO76SPL4VHTS ",
    secretAccessKey: "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",
    region: "us-east-1",
  });

  // Crear el objeto S3
  var s3 = new AWS.S3();

  // Configurar parámetros para la eliminación
  var params = {
    Bucket: "auditflow",
    Key: filename,
  };

  // Eliminar el archivo de S3
  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.error("Error al eliminar el archivo desde S3: ", err);
    } else {
      console.log("Respuesta de eliminación de S3: ", data);
      console.log("Archivo eliminado exitosamente desde S3: ", filename);
      // Después de eliminarlo del bucket, también debes eliminarlo del historial
      removeFileFromHistory(filename);
    }
  });
}
