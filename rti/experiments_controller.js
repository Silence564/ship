const fs = require('fs');
const path = require('path');
// Имя файла с результатами всех экспериментов
const fileName = 'all-experiments.json';


// Путь к файлу
const filePath = path.join(__dirname, 'result', fileName);



let experiment = {
saveExperimentResults(experimentNumber, rtiInstance) {
    const results = {
        experimentNumber,
        finalPositions: rtiInstance.collisionCount,
        boom: rtiInstance.boom,
        
    };
    try {
        let existingResults = [];
        
        // Читаем существующие данные, если файл существует
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            existingResults = JSON.parse(data);
        }
    
        // Добавляем новый эксперимент в массив существующих результатов
        existingResults.push(results);
    
        // Перезаписываем файл с новыми данными
        fs.writeFileSync(filePath, JSON.stringify(existingResults, null, 2), 'utf8');
        console.log("Эксперимент успешно сохранён.");
    } catch (err) {
        console.error("Ошибка при сохранении эксперимента:", err.message);
    }
},

}
module.exports = experiment;