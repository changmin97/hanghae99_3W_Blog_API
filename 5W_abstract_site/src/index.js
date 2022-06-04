class Site {
    constructor() {
        this.boards = []
    }
    addBoard(createdBoard) {
        if (this.boards.find((v) => v.name === createdBoard.name)) {
            throw new Error('it reached here1')
        }
        createdBoard.myBoard = true
        this.boards.push(createdBoard)
    }
    findBoardByName(boardName) {
        return this.boards.find((v) => v.name = boardName)
    }
}
// toThrow()하나당 throw Error 도 하나씩 있어야 한다. / not.toThrow 는 해당X

class Board {
    constructor(boardName) {
        if ( boardName === null || boardName === "" ) {
            throw new Error('it reached here2')
        }
        this.name = boardName
        this.myBoard = false
        this.articles = []
    }
    
}

class Article {}

class Comment {}

module.exports = {
    Site,
    Board,
    Article,
    Comment,
};