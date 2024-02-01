import {cashDrawerState, DGFE_MPD_State, operativeState, printerState, receiptDocumentState} from "./constants";
import {fiscalPrint} from "./js/fiscalprint.js";
import {XMLBuilder} from "fast-xml-parser";

class Printer {

    url = ""
    printer = null

    constructor(ipAddress, protocol = "http") {
        this.url = `${protocol}//${ipAddress}/cgi-bin/fpmate.cgi`;
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

        this.printer.send(this.url, xmlData, 10000);
    }

    getPrinterStatus(onError = null, onReceive = null) {
        const xmlData = this._getPrinterStatusXml();

        const onStatusError = (result) => {
            console.log("[PRINTER][CALLBACK] Errore durante la stampa: " + result);
            const error = this._formatError(result);
            if (onError) onError(error);
        }

        const onStatusReceive = (result, tag_names_array, add_info, res_add) => {
            console.log("[PRINTER][CALLBACK] ", result, tag_names_array, add_info, res_add);
            const status = this._formatStatus(result, add_info);
            if (onReceive) onReceive(status);
        }

        this.sendToPrinter(xmlData, onStatusError, onStatusReceive);
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

    _formatError(error) {
        return {
            code: error?.code,
            success: error?.success,
            message: error?.message
        }
    }

    _formatStatus(status, add_info) {
        const success = status?.success
        if (success) {
            return {
                code: status?.code,
                success: status?.success,
                message: status?.message,
                printerState: printerState[add_info.fpStatus?.substring(0, 1)],
                DGFE_MPD_State: DGFE_MPD_State[add_info.fpStatus?.substring(1, 2)],
                cashDrawerState: cashDrawerState[add_info.fpStatus?.substring(2, 3)],
                receiptDocumentState: receiptDocumentState[add_info.fpStatus?.substring(3, 4)],
                operativeState: operativeState[add_info.fpStatus?.substring(4, 5)]
            }
        }

        return {
            code: status?.code,
            success: status?.success,
            message: status?.message
        }
    }
}

export default Printer