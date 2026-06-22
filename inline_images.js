const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const logoPath = 'C:/Users/user/.gemini/antigravity-ide/brain/ef27bd47-1bb9-4d23-96b3-8a874c8d6146/3d_rendered_logo_1782027312245.png';
const eaglePath = 'C:/Users/user/.gemini/antigravity-ide/brain/ef27bd47-1bb9-4d23-96b3-8a874c8d6146/eagle_view_simulation_1782027326349.png';
const pollutedPath = 'C:/Users/user/.gemini/antigravity-ide/brain/ef27bd47-1bb9-4d23-96b3-8a874c8d6146/coal_mine_polluted_1782019856270.png';
const cleanPath = 'C:/Users/user/.gemini/antigravity-ide/brain/ef27bd47-1bb9-4d23-96b3-8a874c8d6146/coal_mine_clean_1782019870428.png';

try {
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    html = html.replace(/file:\/\/\/C:\/Users\/user\/\.gemini\/antigravity-ide\/brain\/ef27bd47-1bb9-4d23-96b3-8a874c8d6146\/3d_rendered_logo_1782027312245\.png/g, `data:image/png;base64,${logoBase64}`);
    
    const eagleBase64 = fs.readFileSync(eaglePath).toString('base64');
    html = html.replace(/file:\/\/\/C:\/Users\/user\/\.gemini\/antigravity-ide\/brain\/ef27bd47-1bb9-4d23-96b3-8a874c8d6146\/eagle_view_simulation_1782027326349\.png/g, `data:image/png;base64,${eagleBase64}`);

    fs.writeFileSync(indexPath, html);
    console.log("Successfully inline encoded index.html");
} catch (e) {
    console.error("Error modifying index.html:", e);
}

const stylePath = path.join(__dirname, 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');

try {
    const pollutedBase64 = fs.readFileSync(pollutedPath).toString('base64');
    css = css.replace(/file:\/\/\/C:\/Users\/user\/\.gemini\/antigravity-ide\/brain\/ef27bd47-1bb9-4d23-96b3-8a874c8d6146\/coal_mine_polluted_1782019856270\.png/g, `data:image/png;base64,${pollutedBase64}`);
    
    const cleanBase64 = fs.readFileSync(cleanPath).toString('base64');
    css = css.replace(/file:\/\/\/C:\/Users\/user\/\.gemini\/antigravity-ide\/brain\/ef27bd47-1bb9-4d23-96b3-8a874c8d6146\/coal_mine_clean_1782019870428\.png/g, `data:image/png;base64,${cleanBase64}`);

    fs.writeFileSync(stylePath, css);
    console.log("Successfully inline encoded style.css");
} catch (e) {
    console.error("Error modifying style.css:", e);
}
