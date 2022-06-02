const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment');
const jwt = require('jsonwebtoken');
const Joi = require("joi");
const authMiddleware = require('./middlewares/auth-middleware')

const app = express()
const port = 3000

//#mongodb연결
mongoose.connect('mongodb+srv://test:sparta@cluster0.bf4q6.mongodb.net/?retryWrites=true&w=majority',{ 
    dbName : "4W_blogAPI" ,
    ignoreUndefined : true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
 })
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
//미들웨어
app.use(express.json())
//스키마
const User = require('./schemas/user')
const List = require('./schemas/list')
const Comment = require('./schemas/comment')
//라우터
const router = express.Router();
app.use("/api", express.urlencoded({ extended: false }), router);

app.get('/',async(req,res)=>{
    res.send('api/lists로 이동해주세요')
})
app.get('/api',async(req,res)=>{
    res.send('api/lists로 이동해주세요')
})

//게시글관련
router.get('/lists',async(req,res)=>{
    const lists = await List.find({}, {listId:1,title:1,nickname:1,createAt:1, _id: 0} ).sort({createAt:-1})
    res.json({      //우리가 원래아는 find({조건}) 이건 '몽고쿼리 구글링',query((db에)질문,요청한다는 뜻)    //_id:0 으로 제거가능
        lists,
    })
})

router.post('/lists',authMiddleware,async(req,res)=>{
    var createAt = moment().add('9','h').format('YYYY-MM-DD HH:mm:ss')
    const user = res.locals.user
    const nickname = user.nickname
    console.log("글쓴이정보",user)
    const { title, content } = req.body
    

    const maxListId = await List.findOne().sort("-listId")
    let listId = 1
    if(maxListId){
        listId = maxListId.listId + 1
    }
    
    const createdlist = await List.create({ listId, title, content, nickname , createAt })
    res.json({ list : createdlist })

})

router.delete('/lists/:listId',authMiddleware ,async(req,res)=>{
    const { listId } = req.params
    const user = res.locals.user
    const existList = await List.find({ listId: Number(listId)})

    if(!existList){
        return res.status(400).json({success: false, errorMessage: '삭제할 데이터가 없습니다.'})
    }

    if(user.nickname !== existList[0].nickname){
        return res.status(400).json({success: false, errorMessage: '본인의 게시글만 삭제할 수 있습니다.'})
    }
    if(user.nickname === existList[0].nickname){
        await List.deleteOne({ listId: Number(listId) })
        await Comment.deleteMany({ listId: Number(listId) })
        res.json({ successMessage : "성공적으로 삭제하였습니다." })
        return
    }
    
})
router.put('/lists/:listId',authMiddleware ,async(req,res)=>{
    const { listId } = req.params
    const existList = await List.find({ listId: Number(listId)})
    const user = res.locals.user
    const {content, title, name } = req.body
    if(existList.length === 0 ){
        return res.status(200).json({errorMessage:'수정하려는 게시글이 없습니다.'})
    }
    if(user.nickname !== existList[0].nickname){
        return res.status(400).json({errorMessage: '본인의 게시글만 수정할 수 있습니다.'})
    }
    if(user.nickname === existList[0].nickname){
        await List.updateOne({listId}, {$set: {content, title, name} } )
        return res.status(200).json({ succesMessage:'변경 성공했습니다.'})
    }
    if(!content||!title||!name){
        return res.status(400).json({errorMessage: '수정할 값을 입력해 주세요.'})
    }
})

//게시글 상세조회관련(상세조회,댓글)
router.get('/lists/:listId', async (req,res)=>{
    const listId = req.params.listId
    const existList = await List.find({listId:listId}, {content:1, _id: 0} ).sort({createAt:-1})
    const existcomments = await Comment.find({listId:listId}, {commentId:1,title:1,content:1,nickname:1,createAt:1, _id: 0} ).sort({createAt:-1})
    res.json({
        existList,
        existcomments
    })

})
//댓글관련(쓰기,삭제,수정)
router.post('/lists/:listId', authMiddleware, async (req,res)=>{
    var createAt = moment().add('9','h').format('YYYY-MM-DD HH:mm:ss')
    const listId = req.params.listId
    const { content,title } = req.body
    const nickname = res.locals.user.nickname

    const maxCommentId = await Comment.findOne({listId:listId}).sort({commentId:-1})
    console.log("maxCommentId정보는",maxCommentId,"입니다.")
    const targetList = await List.findOne({listId:listId})
    if(targetList === null){
        return res.status(400).json({errorMessage: '존재하지 않은 게시글입니다.'})
    }

    let commentId = 1
    if(maxCommentId){
        commentId = maxCommentId.commentId + 1
    }

    await Comment.create({ commentId, listId, nickname, content,title,createAt })
    res.json({ successMessage : "댓글이 성공적으로 생성되었습니다." })
})

router.delete('/lists/:listId/:commentId', authMiddleware, async(req,res)=>{
    const listId = req.params.listId
    const commentId = req.params.commentId
    const nickname = res.locals.user.nickname

    const existcomment = await Comment.find({$and:[{listId},{commentId} ]})
    if(existcomment.length === 0){
        return res.json({ errorMessage : "삭제할 댓글이 없습니다." })
    }
    if( existcomment[0].nickname !== nickname){
        return res.json({ errorMessage : "본인의 댓글만 삭제가능합니다." })
    }
    await Comment.deleteOne({$and:[{listId},{commentId}]})
    res.json({ successMessage:"정상적으로 삭제 완료하였습니다."})
})

router.put('/lists/:listId/:commentId',authMiddleware ,async(req,res)=>{
    
    const listId = req.params.listId
    const commentId = req.params.commentId
    const nickname = res.locals.user.nickname
    const existcomment = await Comment.find({$and:[{listId},{commentId} ]})
    if(existcomment.length === 0){
        return res.json({ errorMessage : "수정할 댓글이 없습니다." })
    }
    if( existcomment[0].nickname !== nickname){
        return res.json({ errorMessage : "본인의 댓글만 수정가능합니다." })
    }
    
    const { content, title, } = req.body
    await Comment.updateOne({$and:[{listId},{commentId}]}, {$set: {content,title} } )
    res.status(200).json({successMessage:'정상적으로 수정 완료하였습니다.'})
})




//회원가입과 로그인

const postUsersSchema = Joi.object({
    nickname: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')),
    email: Joi.string().email().required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{4,20}$')), 
    confirmPassword: Joi.string().required(),
})
//회원가입 만들고, 동작확인하고 ,댓글을 맨 마지막에 해결하자(안되면 걍 listId,commentId 받고,중복 허용해)
router.post('/users',async(req,res)=>{
    try{
        const { nickname, email, password, confirmPassword } =await postUsersSchema.validateAsync(req.body)
        if(password !== confirmPassword){
            res.status(400).send({
                errorMessage:'패스워드가 패스워드 확인란과 동일하지 않습니다.'
            })
            return
        }
        if(nickname === password){
            res.status(400).send({
                errorMessage:'비밀번호와 닉네임을 동일합니다.서로 다른 값을 입력해주세요.'
            })
            return
        }

        const existUsers = await User.find({$or: [{email},{nickname}] })
        if(existUsers.length){
            res.status(400).send({
                errorMessage:'이미 가입된 이메일 또는 닉네임이 있습니다.'
            })
            return
        }

    
        const user = new User({ email, nickname, password})
        await user.save ()
        res.status(201).send({})

    }catch{
        res.status(400).send({
        errorMessage: "영문 또는 숫자를 포함하여 닉네임은 최소3자,패스워드는 최소4자 이상을 입력해 주세요.",
        })
    }
})

const postAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
  
router.post("/auth", async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if (!user || password !== user.password) {
            res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
        });
        return;
        }
        
        res.send({token: jwt.sign({ userId: user.userId }, "my-secret-key"),});

    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        })
    }
});


app.listen(port, () => {
    console.log(port, '포트가 켜졌어요')
})

//보안할점 정확한status코드명시와 send 하는 메세지 키값을 successMessage,errorMessage 둘중 하나만 포함하고 통일하기,
//라우터 분리