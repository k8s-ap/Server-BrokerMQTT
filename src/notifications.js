const admin = require("firebase-admin");

/* function initFirebase() {
    const serviceAccount = require("../key/testnotificationpushflutter-firebase-adminsdk-614sv-b391a4e5b1.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://testnotificationpushflutter.firebaseio.com"
    });
}; */
function initFirebase() {
    const serviceAccount = require("../key/smarthouse-c4210-firebase-adminsdk-c7pff-d9224cb645");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://smarthouse-c4210.firebaseio.com" /* LUEGO REVISAR SI ES CORRECTA EL NOMBRE DE LA databaseURL */
    });
};

initFirebase();

var db = admin.firestore();

function sendPushToOneUser(notification) {
    const message = {
        token: notification.tokenId,
        data: {
            titulo: notification.titulo,
            mensaje: notification.mensaje
        }
    }
    sendMessage(message);
}

function sendPushToTopic(notification) {
    const message = {
        topic: notification.topic,
        data: {
            titulo: notification.titulo,
            mensaje: notification.mensaje
        }
    }
    sendMessage(message);
}

function sendAlert(amenaza) {
    const message = {
        notification: {
            title: amenaza.titulo,
            body: amenaza.mensaje,
        },
        android: {
            notification: {
                sound: 'default',
                click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
        },
        token: leerTokenDevicefromFirestoreDB(),
        data: {
            sensor: amenaza.sensor,
            time: amenaza.time.toString(),
            value: amenaza.value.toString()
        },
    }
    sendMessage(message);
}

function sendMessage(message) {
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            // console.log('Successfully sent message :', response);
            // console.log(`Amenaza ${message["data"]["sensor"]} notificada satisfactoriamente: ${response}`);
            console.log(`^^^^^^ Amenaza notificada satisfactoriamente. ^^^^^^`);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        })
}

function leerTokenDevicefromFirestoreDB() {
    // return "eAt7XP3yRbaJGvdcuRr7Vw:APA91bE7g8qD2BRKOB7g9GgvOrhk0k6C4LOxOKQjsMrf9n6eUYr9dbMT_0WquEreBXXiDqM3u7U2N1UIhziuAy-nOXkuUzSDstCLl1SRuc0Z7ywgiki9GX2SB9U1S7WNhzARTVnM4rUP";
    return "djmsomH2SVG4M1wzHimAb_:APA91bFs6jsO3-3W0KRTsL1z4fujyIWe76_69xcPzlqSYJs8LxZnkPGCGqbTXd1si1l248e_x07nztsHVAJsAWgUakxttRCaaGWhEGT0Gs8vGxM_uix5WWC-zoSZo2y_WUroWIRnqiYsB";
    
}

function guardarAmenaza(amenaza) {
    db.collection('alertas.de.amenaza').add({
        time: amenaza["time"],
        sensor: amenaza["sensor"],
    })
        .then(function (docRef) {
            // console.log(`Amenaza ${amenaza["sensor"]} registrada satisfactoriamente en la Base de Datos con id: ${docRef.id}`);
            console.log(`****** Amenaza registrada en la Base de Datos. ******`);
        })
        .catch(function (error) {
            console.error("Error editando el documento", error);
        });
}

function actualizarFirestore(destino, mensaje) {    
    const mensaje2 = mensaje;
    if (mensaje["value"] == true) {
        mensaje2["ultimaAmenaza"] = mensaje["time"];
    }    
    db.collection(destino["coleccion"]).doc(destino["documento"]).update(mensaje2)
        .then(function () {
            // console.log("Document successfully updated!");
        })
        .catch(function () {
            // The document probably doesn't exist.
            // console.error("ActualizarFirestore: Error updating document: ", error);
        });

}

module.exports = { sendPushToOneUser, sendPushToTopic, sendAlert, guardarAmenaza, actualizarFirestore }
