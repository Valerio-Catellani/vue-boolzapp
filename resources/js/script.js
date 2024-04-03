
import { contacts, user } from "./data.js";


const { createApp } = Vue;

createApp({
    data() {
        return {
            contacts,
            user,
            activeChat: 1,
        }
    },
    methods: {
        getLastMessageData(user) {
            const sendMessages = user.messages.filter(el => {
                return el.status === 'received'
            });//filtro l'array dei messaggi in modo da otttenere solo quelli che mi ha inviato l'utente
            const lastMessage = sendMessages[sendMessages.length - 1] ?? "";
            return this.getContractedData(lastMessage.date)
        },
        getContractedData(stringDate) {
            if (stringDate) {
                // Dividi la stringa in base allo spazio per ottenere la data e l'ora
                const splitDate = stringDate.split(' ');
                // Dividi l'ora in base ai due punti per ottenere ore e minuti separatamente
                const hoursAndMinutes = splitDate[1].split(':');
                // Ottieni ore e minuti
                const hours = hoursAndMinutes[0];
                const minutes = hoursAndMinutes[1];
                // Formatta le ore e i minuti
                return (hours + ':' + minutes)
            }
        },

        getLastMessage(user) {
            const lastMessage = user.messages[user.messages.length - 1];
            if (lastMessage) {
                let compressedTxt = lastMessage.message.slice(0, 15); // Prende solo i primi 15 caratteri
                if (lastMessage.message.length > 15) {
                    compressedTxt += "..."; // Aggiunge "..." se la lunghezza della stringa originale è maggiore di 15
                }
                return compressedTxt
            }
        },
        changeChat(id) {
            this.activeChat = id
        }


    },
    mounted() {
        console.log(this.contacts);
    },
    computed: {
        activeUser() {
            let filteredUser = [...this.contacts].filter(el => {
                return el.id === this.activeChat
            });
            return filteredUser
        }
    }
}).mount('#app')

