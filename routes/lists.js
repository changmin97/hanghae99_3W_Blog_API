const express = require('express')
const list = require('../schemas/list')
const Lists = require('../schemas/list')
const router = express.Router()
const moment = require('moment');

router.get('/', (req,res)=>{
    res.send('root page')
})


// router.get('/lists',async (req,res)=>{
//     const lists = await Lists.find( {} )
//     res.json({
//         lists,
//     })
// })
//원래 위코드를 아래코드로 수정
router.get('/lists',async (req,res)=>{
    const { name, title, createAt, content } = req.query //추가
                //아래 코드 원래find({},{listId:1,..샬라샬라})인데 name,title,createAt,content 검색기능떔에 넣음
    const lists = await Lists.find({name, title, createAt, content}, {listId:1,title:1,name:1,content:1,createAt:1, _id: 0} ).sort({createAt:-1})
    res.json({      //우리가 원래아는 find({조건}) 이건 '몽고쿼리 구글링',query((db에)질문,요청한다는 뜻)    //_id:0 으로 제거가능
        lists,
    })
})

router.get('/lists/:listId',async (req,res)=>{
    const listId = req.params.listId
    const [detail] = await Lists.find({ listId: Number(listId)})
    res.json({
        detail,
    })

})

router.post('/lists', async (req,res)=>{
    var createAt = moment().add('9','h').format('YYYY-MM-DD HH:mm:ss')


    const { listId, title, name, content, password } = req.body
    const list = await Lists.find({ listId })
    
    if(list.length){
        return res.status(400).json({ success:false, errorMessage: '이미 있는 데이터입니다.'})
    }
    const createdlist = await Lists.create({ listId, title, name, content, password,createAt })
    res.json({ list : createdlist })
})

router.delete('/lists/:listId',async(req,res)=>{
    const { listId } = req.params
    const { password } = req.body
    const existList = await Lists.find({ listId: Number(listId)})
    if(!password){
        return res.status(400).json({success: false, errorMessage: '비밀번호가 비어있습니다.'})
    }

    const [deletelist] = await Lists.find({ listId: Number(listId) })
    console.log('existList:'+existList,'여기서부터는 deletelist:' +deletelist)
    if(!deletelist){
        return res.status(400).json({
            success:false,
            errorMessage:'게시글이 없습니다'
        })
    }
    if(password !== deletelist.password){
        return res.status(400).json({
            success:false,
            errorMessage:'비밀번호가 틀립니다'
        })
    }

    if(existList.length){
        await Lists.deleteOne({ listId: Number(listId) })
    }
    res.json({ success: true })
})


router.put('/lists/:listId',async(req,res)=>{
    const { listId } = req.params;
    const {content, password, title, name } = req.body
    if(!password){
        return res.status(400).json({
            success: false,
            errorMessage: '비밀번호가 틀렸습니다.'
        })
    }
    const [findlist] = await Lists.find({listId})
    if(!findlist){
        return res.status(400).json({
            success : false,
            errorMessage: 'listId에 일치하는 포스터가 없습니다.'
        })
    }
    if(password !==findlist.password){
        return res.status(400).json({
            success:false,
            errorMessage:'비밀번호가 틀렸습니다.'
        })
    }
    await Lists.updateOne({listId}, {$set: {content, title, name} } )
    res.status(200).json({success:true, Message:'변경 성공했습니다.'})
})



module.exports = router