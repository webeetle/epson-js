const {ePOSBuilder, encodeBase64Binary, fiscalPrint} = require('./js/fiscalprint');
const {XMLParser, XMLBuilder} = require('fast-xml-parser');

class Printer {

    url = ""
    printer = null

    constructor(ipAddress) {
        this.url = `${window.location.protocol}//${ipAddress}/cgi-bin/fpmate.cgi`;
        this.printer = new fiscalPrint();
    }

    sendToPrinter(xmlData, onError = null, onReceive = null) {
        if (!this._isValidXml(xmlData)) {
            throw new Error("Dati XML non validi.");
        }

        this.printer.onerror = function (result) {
            console.error("[PRINTER] Errore durante la stampa: " + result);
            if (onError) onError(result);
        }

        this.printer.onreceive = function (result, tag_names_array, add_info, res_add) {
            console.log("[PRINTER] ", result, tag_names_array, add_info, res_add);
            if (onReceive) onReceive(result, tag_names_array, add_info, res_add);
        }

        this.printer.send(this.url, xmlData, 0);
    }

    getPrinterStatus(onError = null, onReceive = null) {
        const xmlData = this._getPrinterStatusXml();
        this.sendToPrinter(xmlData, onError, onReceive);
    }

    _isValidXml(xmlData) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, "application/xml");
            return xmlDoc.getElementsByTagName("parsererror").length === 0;
        } catch (e) {
            return false;
        }
    }

    _getPrinterStatusXml() {
        const statusObj = {
            printerCommand: {
                queryPrinterStatus: ""
            }
        }

        const options = {
            suppressEmptyNode: true
        }

        const builder = new XMLBuilder(options)
        console.log("[PRINTER] XML Stato: ", builder.build(statusObj));
        return builder.build(statusObj);
    }
}

export default Printer