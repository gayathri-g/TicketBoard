<?php

namespace App\Http\Controllers;

use App\Model\Board;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(){
        return view('board');
    }

    public function getBoards(){
        $boards = Board::get()->toArray();
        return response()->json( $boards );
    }
    
    public function storeBoards(Request $request){
        $lastposition = Board::orderBy('id', 'DESC')->first();
        $position = $lastposition ? $lastposition->position + 1 : 1;
        $board = [];

        if($request->action == 'delete'){
            Board::find($request->id)->delete();
        } else {
            $board = $request->id ? Board::find($request->id) : new Board();
            $board->Board_status = $request->action == 'status' ? !$board->Board_status : 1 ;
            $board->Board_name = $request->name;
            $board->Board_description = $request->description;
            $board->Board_type = $request->type;
            $board->Position = $position;
            $board->terms = $request->terms;
            $board->save();
        }

        return response()->json($board);
    }
}
