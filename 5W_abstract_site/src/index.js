class Site { 
    constructor() {
        this.boards = []
    }
    addBoard(board) {
        if (this.boards.find( v => v.name === board.name )) {    
            throw new Error('동일한 이름의 Board가 존재합니다.')
        }
        board.inSite = true
        return this.boards.push(board)
                                                                    // console.log(this, board) 
    }                                                               //콘솔값=> Site { boards: [ Board { name: '공지사항', articles: [], inSite: true }, ] } // Board { name: '공지사항', articles: [], inSite: true }
    findBoardByName(targetBoardName) {
        return this.boards.find((v) => v.name === targetBoardName)
    }
}

class Board { 
    constructor(name) {
        if (name === null || name === "") {
            throw new Error('name을 입력해주세요')
        }
        this.name = name
        this.articles = []
        this.inSite = false
    }
    publish(article) {
       if (this.inSite === false) {
        throw new Error('Site 에 추가된 Board만 사용 가능합니다.')
    }
    article.id = `${this.name}-${Math.random()}`
    article.createdDate = new Date().toISOString()
    article.inArticle = true
    this.articles.push(article)  
    }
    getAllArticles() {
        return this.articles
    }
}

class Article {
    constructor(article) {
        const { subject, content, author } = article
        if ( subject === null || subject === "" || content === null || content === "" || author === null || author === "" ) {
            throw new Error('subject,content,author는 필수값 입니다.')
        }
        this.subject = subject
        this.content = content
        this.author = author
        this.comments = []
        this.inArticle = false
    }
    reply(comment) {
        if (this.inArticle === false) {
            throw new Error('Board에 추가된 Article만 사용 가능합니다')
        }
        comment.createdDate = new Date().toISOString()
        comment.inArticle = false
        return this.comments.push(comment)
    }
    getAllComments() {
        return this.comments
    }
}

class Comment {
    constructor(comment) {
        const { content, author } = comment
        if (content === null || content === "" || author === null || author === "") {
            throw new Error('content와 author는 필수값 입니다.')
        }
        this.content = content
        this.author = author
    }
}

module.exports = {
    Site,
    Board,
    Article,
    Comment,
};
