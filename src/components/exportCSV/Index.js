import React from 'react'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'

const Index = ({ csvData, fileName }) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData)
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: fileType })
        FileSaver.saveAs(data, fileName + fileExtension)
    }
    return (
        <div>
            <button
                type="button"
                style={styles.btn}
                className="btn shadow-none"
                onClick={(e) => exportToCSV(csvData, fileName)}
            >Export to XLSX</button>
        </div>
    );
};

export default Index;

const styles = {
    btn: {
        minWidth: 150,
        height: 37,
        fontSize: 14,
        fontWeight: 600,
        color: '#7367f0',
        padding: '8px 0px',
        background: '#7267f02f',
        borderRadius: 25
    }
}