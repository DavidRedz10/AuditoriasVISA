        function createSectionObject(name, ptlf, title1, input1, input2, title2, input3, input4) {
            return {
            name: name,
            ptlf: ptlf,
            title1: title1,
            input1: input1,
            input2: input2,
            title2: title2,
            input3: input3,
            input4: input4
            };
        } 

        var today = new Date();

        // Obtener los componentes de la fecha
        var year = today.getFullYear();
        var month = (today.getMonth() + 1).toString().padStart(2, '0'); // Los meses son indexados desde 0
        var day = today.getDate().toString().padStart(2, '0');

        var formattedDate = `${year}-${month}-${day}`;


        function loadFile(url, callback) {
        PizZipUtils.getBinaryContent(url, callback);
        }


        //Funcion de generar documento  
        window.generate = function generate() {


        if (sectionCount < 1) {
            alert("Debes agregar al menos una sección antes de generar el documento.");
            return;
        }


        const sections = []; // Arreglo para almacenar objetos de sección
        
        for (var i = 1 ; i <= sectionCount; i++) {

        
        const nameValue = document.getElementById(`nameInput${i}`).value;
    
        const ptlfValue = document.getElementById(`ptlf${i}`).value;

        const title1Value = document.getElementById(`title1${i}`).value;

        const Input1Value = document.getElementById(`Input1${i}`).value;

        const Input2Value = document.getElementById(`Input2${i}`).value;

        const title2Value = document.getElementById(`title2${i}`).value;

        const Input3Value = document.getElementById(`Input3${i}`).value;

        const Input4Value = document.getElementById(`Input4${i}`).value;

        const section = createSectionObject(nameValue, ptlfValue, title1Value, Input1Value, Input2Value, title2Value, Input3Value, Input4Value);
        sections.push(section);

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

            // Render the document 
            var renderedSections = []; // Un arreglo para almacenar las secciones renderizadas

            // Iterar sobre el arreglo 'sections' y almacenar cada sección renderizada en 'renderedSections'
            sections.forEach(function(section) {
                var renderedSection = {
                    name: section.name,
                    PTLF: section.ptlf,
                    title1: section.title1,
                    input1: section.input1,
                    input2: section.input2,
                    title2: section.title2,
                    input3: section.input3,
                    input4: section.input4
                };
                renderedSections.push(renderedSection);
            });
            
            // Luego, pasar el arreglo 'renderedSections' a 'doc.render'
            doc.render({
                "Section": renderedSections
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
            saveAs(blob, "Auditoria " + sections[0].name+ " / " + formattedDate + ".docx");
            }
        );
        console.log(sections); 
        console.log(renderedSections);

        };

        function cleanInputs() {
            for (var i = 1 ; i <= sectionCount; i++) {
        document.getElementById(`ptlf${i}`).value = "";        
        document.getElementById(`nameInput${i}`).value = "";
        document.getElementById(`Input1${i}`).value = "";
        document.getElementById(`Input2${i}`).value = "";
        document.getElementById(`Input3${i}`).value = "";
        document.getElementById(`Input4${i}`).value = "";
            }
        }




        var sectionCount = 0; // Contador para hacer un seguimiento del número de secciones agregadas

        function addSection() {
        sectionCount++; // Incrementa el contador de secciones

        // Crea un nuevo div con la clase "card" y su contenido
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
        </body>
        `;

        // Agrega la nueva sección al documento
        document.body.appendChild(newSection);

        // Asegúrate de que el nuevo textarea se pueda redimensionar automáticamente
        autoResize(newSection.querySelector(`#nameInput${sectionCount}`));
        }


        const clase = "card";

        function eliminarElementosPorClase() {
            const elementosEliminar = document.querySelectorAll("." + "NuevaSec");
        
            elementosEliminar.forEach(function (elemento) {
                elemento.remove();
            });


        sectionCount = 0;
        }