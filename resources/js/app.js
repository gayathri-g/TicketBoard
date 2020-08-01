/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import draggable from 'vuedraggable'

if ($('#app').length > 0) {
    const app = new Vue({
        el: '#app',
    });
}

if ($('#board-app').length > 0) {
    const app = new Vue({
        el: '#board-app',
        data: {
            boards: [],
            board: {
                name: '',
                description: '',
                type: '',
                terms: ''
            }
        },
        components: {
            // draggable,  
        },
        mounted() {
            $('#AddBoard').modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            })
            $('#deleteModal').modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            })
            $('#activateModal').modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            })

            this.getBoards();
        },
        methods: {
            getBoards() {
                var self = this;
                axios.get('/get-boards').then(function (response) {
                    self.boards = response.data;
                    console.log(response.data);
                });
            },
            resetBoard() {
                this.board = {
                    name: '',
                    description: '',
                    type: '',
                    terms: ''
                }
            },
            storeBoard() {
                var self = this;
                if (!self.board.action) {
                    self.board.action = 'store';
                }
                axios.post('/store-boards', this.board).then(function (response) {
                    if (self.board.action == 'store') {
                        self.boards.push(response.data);
                    } else if (self.board.action == 'delete') {
                        var index = _.findIndex(self.boards, {
                            id: self.board.id
                        });
                        self.boards.splice(index, 1);
                    } else {
                        var index = _.findIndex(self.boards, {
                            id: self.board.id
                        });
                        self.boards.splice(index, 1, response.data);
                    }
                    var divId = '';
                    (self.board.action == 'edit' || self.board.action == 'store') ? (divId = 'AddBoard') : (self.board.action == 'delete' ? divId = 'deleteModal' : divId = 'activateModal');
                    $('#' + divId).modal('hide');
                    self.resetBoard();
                    console.log(response.data);
                });
            },
            boardAction(board, action) {
                this.board = {
                    name: board.Board_name,
                    description: board.Board_description,
                    type: board.Board_type,
                    terms: board.terms,
                    id: board.id,
                    action: action
                }
                var divId = '';
                action == 'edit' ? (divId = 'AddBoard') : (action == 'delete' ? divId = 'deleteModal' : divId = 'activateModal');
                $('#' + divId).modal('show');
            }
        }
    });
}
