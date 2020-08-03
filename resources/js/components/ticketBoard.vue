<template>
    <div>
        <br>
        <h3>Ticket Board</h3>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#AddBoard" id="add-board">
            Add board </button>
        <br>
        <br>
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody v-if="boards.length > 0">
                <tr v-for="(board, index) in boards">
                    <th scope="row">{{index + 1}}</th>
                    <td>{{board.Board_name}}</td>
                    <td>{{board.Board_description}}</td>
                    <td>
                        <span @click="boardAction(board,'edit')">Edit</span>
                        <span @click="boardAction(board,'delete')">Delete</span>
                        <span @click="boardAction(board,'status')"> <Span v-if="board.Board_status == 1">
                                Deactivate</Span> <Span v-else> Activate</Span></span>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="100%">No Boards found</td>
                </tr>
            </tbody>
        </table>

        <div class="modal fade" id="AddBoard" tabindex="-1" role="dialog" aria-labelledby="AddBoardLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="AddBoardLabel">Add Board</h5>
                    </div>
                    <div class="modal-body">
                        <form id="store-board-data">
                            <div class="schedule-cnt-part">
                                <div class="row">
                                    <div
                                        class="form-group col-md-12 col-lg-12 col-sm-12 col-xs-12 schedule-content mb-3">
                                        <h5 class="schedule-sub-head">Board Name<span class="error">*</span></h5>
                                        <input class="form-control" name="board_name" type="text"
                                            placeholder="Board Name" id="class_name" v-model="board.name">
                                    </div>
                                    <div class="form-group col-md-12 col-lg-12 col-sm-12 col-xs-12  schedule-content">
                                        <h5 class="schedule-sub-head">Board Description</h5>
                                        <textarea class="form-control" name="board_description" type="text" rows="5"
                                            placeholder=""
                                            v-model="board.description"> </textarea>
                                    </div>

                                    <div
                                        class="form-group col-md-12 col-lg-12 col-sm-12 col-xs-12 schedule-content mb-3">
                                        <h5 class="schedule-sub-head">Select Type <span class="error">*</span></h5>
                                        <select class="form-control" id="recurring_type" name="board_type"
                                            v-model="board.type">
                                            <option value="">Select Type</option>
                                            <option value="private">Private</option>
                                            <option value="public">Public</option>
                                        </select>
                                    </div>
                                    <div
                                        class="form-group col-md-12 col-lg-12 col-sm-12 col-xs-12 schedule-content mb-3">
                                        <div class="form-group">
                                            <div class="control-label col-md-12"></div>
                                            <div class="controls col-md-12">
                                                <label class="checkbox" for="is_recurring">
                                                    <input type="checkbox" id="is_recurring" name="terms"
                                                        v-model="board.terms"> Terms and conditions
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"
                            @click="resetBoard()">Close</button>
                        <button type="button" class="btn btn-primary" @click="storeBoard()">Save changes</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Confirm</h5>
                    </div>
                    <div class="modal-body">
                        Are you sure want to delete this board?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"
                            @click="resetBoard()">Close</button>
                        <button type="button" class="btn btn-primary" @click="storeBoard()">Save changes</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="activateModal" tabindex="-1" role="dialog" aria-labelledby="activateModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="activateModalLabel"><Span v-if="board.Board_status == 1">
                                Deactivate</Span> <Span v-else> Activate</Span> board</h5>
                    </div>
                    <div class="modal-body">
                        Are you sure want to <Span v-if="board.Board_status == 1"> Deactivate</Span> <Span v-else>
                            Activate</Span> board ?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"
                            @click="resetBoard()">Close</button>
                        <button type="button" class="btn btn-primary" @click="storeBoard()">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        data: function () {
            return {
                boards: [],
                board: {
                    name: '',
                    description: '',
                    type: '',
                    terms: ''
                }
            }
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
                    (self.board.action == 'edit' || self.board.action == 'store') ? (divId = 'AddBoard') : (self
                        .board.action == 'delete' ? divId = 'deleteModal' : divId = 'activateModal');
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
                action == 'edit' ? (divId = 'AddBoard') : (action == 'delete' ? divId = 'deleteModal' : divId =
                    'activateModal');
                $('#' + divId).modal('show');
            }
        }
    }

</script>
