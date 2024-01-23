const transectionModel = require('../models/transectionModel')
const dayjs = require('dayjs')

const getAllTransection = async (req,res) =>{
    try {
        const {frequency,selectedDate,type,reference} = req.body
        const transection = await transectionModel.find({
            ...(frequency !== 'custome' 
            ? {
                date:{
                    $gte: dayjs().subtract(Number(frequency),'d').toDate(),
                }
            } : {
                date :{
                    $gte: selectedDate[0],
                    $lte: selectedDate[1],
                }
            }),
            userid:req.body.userid,

            ...(type!=='all' &&{type}), 
            ...(reference !== 'all' && { reference }), 
            
           
        })
        res.status(200).json(transection)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)   
    }
}


const deleteTransection = async (req,res) =>{
    try {
        await transectionModel.findOneAndDelete({_id:req.body.transectionId})
        res.status(201).send('Delete Successfully')
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const editTransection = async (req,res) => {
    try {
        await transectionModel
        .findOneAndUpdate({_id:req.body.transactionId},
            req.body.payload
            )
            res.status(201).send('Edit Successfully')
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


const addTransection = async (req,res) => {
    try {
        const newTransection = new transectionModel(req.body)
        await newTransection.save()
        res.status(201).send('Transection create')
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}







module.exports = {getAllTransection,addTransection,editTransection,deleteTransection}