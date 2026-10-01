const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'officer', 'AILearningAssistant.jsx');
let content = fs.readFileSync(targetPath, 'utf8');
content = content.replace('getTrainerMaterials', 'getUploadedMaterials');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('AILearningAssistant.jsx import updated successfully');
