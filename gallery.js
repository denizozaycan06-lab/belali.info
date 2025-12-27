const container = document.getElementById('exhibit-container');
const params = new URLSearchParams(window.location.search);
const currentDrop = params.get('drop');


const dropMetadata = {
   "drop1": {
        title: "GENESIS",
        motto: "SPEED IS A RAW EMOTION.",
        desc: "Bu koleksiyon, otomotiv tarihinin en agresif formlarını dijital brutalizm ile birleştirir."
    },
    "drop2": {
        title: "col2",
        motto: "motto2",
        desc: "desc2"
    } 
};

async function loadExhibition() {
    try {
         const response = await fetch('posters.json');
         if (!response.ok) throw new Error("no data found");


         const allPosters = await response.json();
         
         const dropInfo = dropMetadata[currentDrop];
         const filteredPosters = allPosters.filter(p => p.drop === currentDrop);


         if(!dropInfo || filteredPosters.length === 0) {
            container.innerHTML = "<h1 style=' color:white; text-align:center; margin-top:40vh;'>DROP NOT FOUND [404]</h1>";
           return;
         }

         const introPanel = document.createElement('section');
         introPanel.classList.add('exhibit-panel');
         introPanel.style.justifyContent = "center";
         introPanel.style.alignItems = "center";
         introPanel.style.textAlign = "center";
         introPanel.style.flexDirection = "column"; 

         introPanel.innerHTML = `
            <p style="font-family:'Courier New'; color:#555; letter-spacing:5px;">COLLECTION // ${currentDrop.toUpperCase()}</p>
            <h1 style="font-size: 6rem; line-height:1; margin: 20px 0;">${dropInfo.title}</h1>
            <p style="font-size: 1.5rem; color:#fff; font-weight:300; letter-spacing:2px; font-style:italic;">
                "${dropInfo.motto}"
            </p>
            
             <p style="margin-top:20px; font-size:0.8rem; color:#888;">SCROLL TO EXPLORE</p>
        `;
        
        container.appendChild(introPanel);

        filteredPosters.forEach(poster => {
            const section = document.createElement('section');
            section.classList.add('exhibit-panel'); 

            section.innerHTML = `
                <div class="exhibit-image">
                    <img loading="lazy" src="${poster.image}" alt="${poster.title}">
                </div>
                
                <div class="exhibit-info">
                    <span class="exhibit-year">// ${poster.year}</span>
                    <h1 class="exhibit-title">${poster.title}</h1>
                    <h3 class="exhibit-subtitle">${poster.subtitle || ""}</h3>
                    <p class="exhibit-story">
                        ${poster.story}
                    </p>
                </div>
            `;

            container.appendChild(section);
        });
    } catch (err) { console.error(err); }
}

loadExhibition();