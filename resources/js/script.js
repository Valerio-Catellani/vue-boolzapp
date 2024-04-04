
import { contacts, mainUser, response } from "./data.js";


const { createApp } = Vue;
const dateTime = luxon.DateTime;

createApp({
    data() {
        return {
            contacts: [...contacts],
            mainUser,
            activeChat: 1,
            userMessage: '',
            userSearch: '',
            messageMenuOpen: '',

        }
    },
    methods: {
        /**
         * serve per indicare solo ora e minuti invece che la data completa
         * @param {*} stringDate 
         * @returns 
         */
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
        /**
         * ottengo l'ultimo messagggio inviato o ricevuto dal contatto in modo da metterlo nella preview dei messafggi
         * @param {*} user 
         * @returns 
         */
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
        getLastMessageData(user) {
            const sendMessages = user.messages.filter(el => {
                return el.status === 'received'
            });//filtro l'array dei messaggi in modo da otttenere solo quelli che mi ha inviato l'utente
            const lastMessage = sendMessages[sendMessages.length - 1] ?? "";
            return this.getContractedData(lastMessage.date)
        },
        /**
         * gestisce il cambio della chat a destra
         * @param {*} id 
         */
        changeChat(id) {
            this.activeChat = id
        },
        /**
         * Serve per andare a controllare e modificare i colori delle spunte. 
         * @param {*} user 
         * @param {*} element 
         * @returns 
         */
        changeColor(user, element) {
            let lastMessage = null;
            for (let i = user.messages.length - 1; i >= 0; i--) {
                if (user.messages[i].status === 'received') {
                    lastMessage = user.messages[i];
                    break
                }
            }
            if (user.messages.indexOf(element) < user.messages.indexOf(lastMessage)) {
                return 'text-primary'
            } else {
                return 'hype-txt-grey'
            }

        },
        /**
         * gestisco l'invio e la risposta dei messaggi
         * @param {*} user 
         */
        sendMessage(user) {
            let messageToCheck = this.userMessage.trim(' ');
            if (messageToCheck) {
                let newMessage = {
                    date: dateTime.now().setLocale('it').toFormat('dd/MM/yyyy HH:mm:ss'),
                    message: this.userMessage,
                    status: 'sent'
                };
                user.messages.push(newMessage);
                this.userMessage = '';
                this.createResponse(user);
            }

        },
        createResponse(user) {
            const delay = this.getRndInteger(3, 4) * 1000;
            if (user.visible === true) {
                setTimeout(() => {
                    user.visible = 'online';
                    setTimeout(() => {
                        user.visible = 'typing';
                        setTimeout(() => {
                            let newMessage = {
                                date: dateTime.now().setLocale('it').toFormat('dd/MM/yyyy HH:mm:ss'),
                                message: response[this.getRndInteger(0, response.length)],
                                status: 'received'
                            };
                            user.messages.push(newMessage);
                            user.visible = 'online';
                            setTimeout(() => {
                                user.visible = true;
                            }, delay)
                        }, delay * 2)
                    }, delay)
                }, delay / 2)
            }
        },
        openMenu(message) {
            setTimeout(() => {
                this.messageMenuOpen = message;
            }, 100)
        },
        deleteMessage(element) {
            this.activeUser.messages.splice(this.activeUser.messages.indexOf(element), 1)
        },







        getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },


    },
    mounted() {
        //console.log(this.contacts);
    },
    computed: {
        activeUser() {
            return (this.contacts.find(el => el.id === this.activeChat));
        },
        searchContacts() {
            const searchLower = this.userSearch.toLowerCase();
            let filteredArrayOfContacts = this.contacts.filter(el => {
                return el.name.toLowerCase().includes(searchLower)
            })
            return filteredArrayOfContacts;
        }
    }
}).mount('#app')




console.log(dateTime.now().setLocale('it').toFormat('dd/MM/yyyy HH:mm:ss'));