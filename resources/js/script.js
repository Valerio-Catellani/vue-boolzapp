
import { contacts, user } from "./data.js";


const { createApp } = Vue;

createApp({
    data() {
        return {
            contacts: [...contacts],
            user,
            activeChat: 1,
            userMessage: '',
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
        },
        sendMessage(user) {
            const currentDate = new Date();
            // Formattare la data
            const formattedDate = `${('0' + (currentDate.getDate())).slice(-2)}/` +
                `${('0' + (currentDate.getMonth() + 1)).slice(-2)}/` +
                `${currentDate.getFullYear()}`;
            // Formattare l'ora
            const formattedTime = `${('0' + currentDate.getHours()).slice(-2)}:` +
                `${('0' + currentDate.getMinutes()).slice(-2)}:` +
                `${('0' + currentDate.getSeconds()).slice(-2)}`;
            // Combinare la data e l'ora formattate
            const formattedDateTime = `${formattedDate} ${formattedTime}`;
            let newMessage = {
                date: formattedDateTime,
                message: this.userMessage,
                status: 'sent'
            };
            user.messages.push(newMessage);
            this.userMessage = '';
            this.createResponse(user)
        },
        createResponse(user) {
            user.visible = 'typing';

        }


    },
    mounted() {
        console.log(this.contacts);
    },
    computed: {
        activeUser() {
            let filteredUser = this.contacts.filter(el => {
                return el.id === this.activeChat
            });
            console.log(filteredUser[0]);
            return filteredUser
        }
    }
}).mount('#app')
