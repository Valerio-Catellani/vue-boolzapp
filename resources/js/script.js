
import { contacts, mainUser, response } from "./data.js";
import Picker from './emoji-picker.js';


const { createApp } = Vue;
const dateTime = luxon.DateTime;

createApp({
    data() {
        return {
            contacts: [...contacts], //ottengo l'array dei contatti
            mainUser, //mainUser
            activeChat: 0,
            openElements: {
                messageMenuOpen: '',
                fullChatOptionsMenu: false,
                showModal: false,
                showEmoji: false,
            },
            userInput: {
                userMessage: '',
                userSearch: '',
                addNewContact: {
                    name: '',
                    surname: '',
                    phone: ''
                },
                emoji: '',
            },
            loadingBar: {
                isLoading: true, // Stato del caricamento
                progress: 0,
                opacity: 100,
            },
            dimension: null,
            darkMode: false
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
            user.lastTimeOnline = lastMessage;
            // return this.getContractedData(lastMessage.date)
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
            let messageToCheck = this.userInput.userMessage.trim(' ');
            if (messageToCheck) {
                let newMessage = {
                    date: dateTime.now().setLocale('it').toFormat('dd/MM/yyyy HH:mm:ss'),
                    message: this.userInput.userMessage,
                    status: 'sent'
                };
                user.messages.push(newMessage);
                this.userInput.userMessage = '';
                this.openElements.showEmoji = false;
                this.createResponse(user);
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            }
        },
        createResponse(user) {
            const delay = this.getRndInteger(3, 4) * 1000;
            if (user.visible === true) {
                user.visible = 'inactive';
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
                            this.$nextTick(() => {
                                this.scrollToBottom();
                            });
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
                this.openElements.messageMenuOpen = message;
            }, 100)
        },
        openElement(el) {
            setTimeout(() => {
                this.openElements[el] = !this.openElements[el];
            }, 100)
        },
        deleteMessage(element) {
            this.activeUser.messages.splice(this.activeUser.messages.indexOf(element), 1)
        },
        deleteAllMessage(user) {
            user.messages = [];
        },
        deleteContact(user) {
            let userToCandelIndex = this.contacts.indexOf(user);
            this.contacts.splice(userToCandelIndex, 1);
            this.activeChat = 0

        },
        reset() {
            this.openElements.messageMenuOpen = '';
            this.openElements.fullChatOptionsMenu = false;
        },
        addContact() {
            const newID = this.contacts.map(el => el.id).sort((a, b) => b - a)[0] + 1 ?? 1;
            const newC = {
                id: newID,
                name: this.userInput.addNewContact.name + ' ' + this.userInput.addNewContact.surname,
                avatar: `./img/avatar_${this.getRndInteger(1, 8)}.jpg`,
                visible: true,
                lastOnline: '16:00',
                messages: []
            };
            this.contacts.push(newC);
            this.openElements.showModal = false
        },
        scrollToBottom() {
            // Trova l'elemento chatContainer utilizzando il riferimento
            const chatContainer = this.$refs.chatContainer;

            // Sposta lo scroll verso il basso
            chatContainer.scrollTop = chatContainer.scrollHeight;
        },
        onSelectEmoji(emoji) {
            this.userInput.userMessage += emoji.i;
        },
        simulateLoading() {
            this.loadingBar.isLoading = true;
            let interval = setInterval(() => {
                this.loadingBar.progress += 10;
                if (this.loadingBar.progress >= 100) {
                    clearInterval(interval);
                    let pageInterval = setInterval(() => {
                        this.loadingBar.opacity -= 10;
                        if (this.loadingBar.opacity <= 0) {
                            clearInterval(pageInterval);
                            this.loadingBar.isLoading = false;
                            this.loadingBar.progress = 0;
                        }
                    }, 30)
                }
            }, 150);
        },
        checkMediaQuery() {
            this.dimension = document.documentElement.clientWidth;
        },
        toggleDarkMode() {
            console.log(this.darkMode);
            this.darkMode = !this.darkMode;
            document.documentElement.style.setProperty('--contacts-background', this.darkMode ? 'black' : '#f3f6f8');
            document.documentElement.style.setProperty('--primary', this.darkMode ? '#222E35' : '#f3f6f8');
            document.documentElement.style.setProperty('--hype-text-primary', this.darkMode ? 'white' : 'black');
            document.documentElement.style.setProperty('--notifications-background', this.darkMode ? '#eaa315' : '#8EDAFC');
            document.documentElement.style.setProperty('--contacts-background-inactive', this.darkMode ? 'black' : 'white');
            document.documentElement.style.setProperty('--contacts-background-active', this.darkMode ? '#222E35' : '#d9d9df');
        },
        getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
    },
    mounted() {
        this.checkMediaQuery();
        window.addEventListener('resize', this.checkMediaQuery);
    },
    created() {
        this.simulateLoading();
    },

    computed: {
        activeUser() {
            this.reset(); //resetto il campo del messaggio
            this.openElements.showEmoji = false;
            return (this.contacts.find(el => el.id === this.activeChat));
        },
        searchContacts() {
            const searchLower = this.userInput.userSearch.toLowerCase();
            let filteredArrayOfContacts = this.contacts.filter(el => {
                return el.name.toLowerCase().includes(searchLower)
            })
            return filteredArrayOfContacts;
        },
        lastTimeOnline() {
            let aU = this.activeUser;
            const sendMessages = aU.messages.filter(el => {
                return el.status === 'received'
            });//filtro l'array dei messaggi in modo da otttenere solo quelli che mi ha inviato l'utente
            if (sendMessages.length > 0) {
                const lastMessageDate = sendMessages[sendMessages.length - 1].date;
                const formattedDate = this.getContractedData(lastMessageDate);
                aU.lastOnline = formattedDate
                return formattedDate
            }
            return aU.lastOnline
            // return formattedDate
        },
        checkInput() {
            const valuesArray = Object.values(this.userInput.addNewContact);
            return valuesArray.every(el => el !== '')
        },
    }
}).component('Picker', Picker).mount('#app')




//console.log(dateTime.now().setLocale('it').toFormat('dd/MM/yyyy HH:mm:ss'));