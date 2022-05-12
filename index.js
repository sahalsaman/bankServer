// import = require
const express=require("express")
const dataService=require("./services/data.services")
const jwt=require("jsonwebtoken")
const { verify } = require("jsonwebtoken")
const cors=require('cors')

const app=express()

//parse json data
app.use(express.json())

app.use(cors({
    origin:"http://localhost:4200"
}))

// // rest API 
// app.get("/",(req,res)=>{
//     res.send("Get request ")
// })

// app.post("/",(req,res)=>{
//     res.send("POST request");
// })

// app.put("/",(req,res)=>{
//     res.send("PUT request")
// })

// app.patch("/",(req,res)=>{
//     res.send("patch request")
// })

// app.delete("/",(req,res)=>{
//     res.send("DELETE request")
// })

// bank app

const jwtMiddleWare=(req,res,next)=>{
    try{
        const token=req.headers['access-token']
        const data=verify(token,"topsecret369258147key")
        req.currentacno=data.currentacno
        next()
    }catch{
        res.status(401).json({
            statusCode:401,
            status:false,
            messege:"please log In!!!!"
        })
    }
}

app.post("/register",(req,res)=>{
     dataService.register(req.body.uname,req.body.acno,req.body.password).then(result=>{
        res.status(result.statusCode).json(result)
     })
})

app.post("/login",(req,res)=>{
    dataService.login(req.body.acno,req.body.pswd).then(result=>{
        res.status(result.statusCode).json(result)
    })
})
app.post("/deposit",jwtMiddleWare,(req,res)=>{
    dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amt).then(result=>{
        res.status(result.statusCode).json(result)
    })
})
app.post("/withdraw",jwtMiddleWare,(req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amt).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})
app.post("/transaction",jwtMiddleWare,(req,res)=>{
    dataService.transaction(req,req.body.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})
app.delete("/deleteAcc/:acno",jwtMiddleWare,(req,res)=>{
    dataService.onDelete(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })

})

app.listen(3000,()=>{
    console.log("server started at 3000")
    
})