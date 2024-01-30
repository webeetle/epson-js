const printerState = {
    0: "OK",
    2: "Carta in esaurimento",
    3: "Offline (fine carta o coperchio aperto)",
    default: "Risposta errata"
}

const DGFE_MPD_State = {
    0: "OK",
    1: "Prossimo ad Esaurimento",
    2: "Da Formattare",
    3: "Precedente",
    4: "Di altro misuratore",
    5: "Esaurito",
    default: "Risposta errata"
}

const cashDrawerState = {
    0: "Aperto",
    1: "Chiuso",
    default: "Risposta errata"
}

const receiptDocumentState = {
    0: "Fiscale aperto",
    1: "Fiscale/Non fiscale chiuso",
    2: "Non fiscale aperto",
    3: "Pagamento in corso",
    4: "Errore ultimo comando ESC/POS con Fiscale/Non fiscale chiuso",
    5: "Scontrino in negativo",
    6: "Errore ultimo comando ESC/POS con Non fiscale aperto",
    7: "Attesa chiusura scontrino modalit&agrave; JAVAPOS",
    8: "Documento fiscale aperto",
    9: "Nota di credito aperta da PC",
    A: "Titolo aperto",
    B: "Titolo chiuso",
    default: "Risposta errata"
}

const operativeState = {
    0: "Stato registrazione",
    1: "Stato X",
    2: "Stato Z",
    3: "Stato Set",
    4: "Modalit&agrave; Biglietteria",
    5: "Nota di credito aperta da tasteria",
    default: "Risposta errata"
}

export {
    printerState,
    DGFE_MPD_State,
    cashDrawerState,
    receiptDocumentState,
    operativeState
}