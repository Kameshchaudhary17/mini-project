import multer from "multer"

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, './storage') // cb(error, success ) , cb(error)
    }, 
    filename : function(req,file,cb){
       cb(null, Date.now() + "-" + file.originalname)
    }
})

export {
    multer, 
    storage 
}