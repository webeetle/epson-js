const {ePOSBuilder, CanvasPrint, encodeBase64Binary, ePOSPrint, fiscalPrint} = require('./js/fiscalprint')

class Printer {

    url = ""

    constructor(ipAddress) {
        this.url = `${window.location.protocol}//${ipAddress}/cgi-bin/fpmate.cgi`;
        this.printer = new fiscalPrint(); // Assumiendo che ePOSPrint sia una classe per gestire la stampante.
    }

    // Metodo per inviare dati XML alla stampante
    sendToPrinter(xmlData) {
        if (!this._isValidXml(xmlData)) {
            throw new Error("Dati XML non validi.");
        }

        this.printer.onerror = function (result) {
            console.error("[PRINTER] Errore durante la stampa: " + result);
        }

        this.printer.onreceive = function (result, tag_names_array, add_info, res_add) {
            console.log("[PRINTER] ", result, tag_names_array, add_info, res_add);
        }

        this.printer.send(this.url, xmlData, 0);
    }

    // Metodo privato per validare i dati XML
    _isValidXml(xmlData) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, "application/xml");
            return xmlDoc.getElementsByTagName("parsererror").length === 0;
        } catch (e) {
            return false;
        }
    }
}

export default Printer