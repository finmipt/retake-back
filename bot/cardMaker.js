const readXlsxFile = require('read-excel-file/node')
const { createReport } = require('docx-templates')
const fs = require('fs');
const DocxMerger = require('docx-merger');
const path = require('path');

const template = fs.readFileSync('./bot/static/sample.docx');
const cardsPerPage = 6;

const outputPath = path.join(__dirname, 'output');

// Ensure output directory exists
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

async function readExcelFile(filePath) {
    console.log('Reading file');
    try {
        // Wait for the readXlsxFile to complete and return the rows
        const rows = await readXlsxFile(filePath);
        return rows;  // Now this will return the rows to the caller
    } catch (error) {
        console.error('Error reading Excel file:', error);
        return [];  // Return an empty array in case of error
    }
}

async function generateDocumentForPage(rows, pageNumber, location, materials) {
    const context = {};
    context['location'] = location;
    context['materials'] = materials;
    for (let card = 1; card <= cardsPerPage; card++) {
        const rowIndex = (pageNumber - 1) * cardsPerPage + card;
        const row = rows[rowIndex];

        if (!row) {

            context[`name_${card}`] = 'none';
            context[`group_${card}`] = 'none';
            context[`work_${card}`] = 'none';
            context[`teacher_${card}`] = 'none';
        }
        else {
            context[`name_${card}`] = row[0];
            context[`group_${card}`] = row[1];
            context[`work_${card}`] = row[3];
            context[`teacher_${card}`] = row[4];
        }
    }
    const report = await createReport({
        template,
        //output: path.join(outputPath, `output_${pageNumber}.docx`),
        data: context,
        cmdDelimiter: ['{{', '}}'],
    });
    return report;
}

async function processExcelAndGenerateDocuments(filePath, location, materials, userId) {
    const rows = await readExcelFile(filePath);  // Получаем данные из файла
    if (!rows || rows.length === 0) {
        console.log('No data found in the Excel file.');
        return null;  // Возвращаем null, если данных нет
    }
    const pageCount = Math.ceil(rows.length / cardsPerPage);
    const pagesToMerge = [];

    for (let page = 1; page <= pageCount; page++) {
        const report = await generateDocumentForPage(rows, page, location, materials);
        if (report) {
            pagesToMerge.push(report);
        } else {
            console.log(`No report generated for page ${page}`);
        }
    }
    if (pagesToMerge.length > 0) {
        const mergedDoc = new DocxMerger({ pageBreak: false }, pagesToMerge);
        const filePath = path.join(outputPath, `output_${userId}.docx`);
        return new Promise((resolve, reject) => {
            mergedDoc.save('nodebuffer', function (data) {
                fs.writeFile(filePath, data, function (err) {
                    if (err) {
                        console.error('Error saving merged document:', err);
                        reject(err);
                    } else {
                        console.log('Merged document saved successfully');
                        resolve(filePath);
                    }
                });
            });
        });
    } else {
        console.log('No pages to merge');
        return null;  // Возвращаем null, если нет страниц для объединения
    }
}

module.exports = processExcelAndGenerateDocuments;