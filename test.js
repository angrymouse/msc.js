let express=require("express")
let request=request("request")
let app=express()
app.get("/samplereq",(req,res)=>{
  request.get("ссылка",(err,result)=>{
    //текст в result, можно редактировать
    res.send(result)//отправить в качестве ответа по ссылке
    console.log(result);//вывести текст в консоль
  })
})
