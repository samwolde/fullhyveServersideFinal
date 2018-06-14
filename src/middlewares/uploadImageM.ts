import * as express from 'express';
const multer = require('multer');
const fileType = require('file-type');
const fs = require('fs');
const app = express();
const router = express.Router();

export class UploadM{
    static upload(req:any, res:any, callback:any){
        console.log("In multer");
        (multer({
            dest:__dirname + "/../../public/images/", 
            limits: {fileSize: 10000000, files: 1},
            fileFilter:  (req:any, file:any, callback:any) => {
                console.log("In here");
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only Images are allowed !'), false);
                }
        
                callback(null, true);
            }
        }).single('image'))(req, res, callback);
    }
    
    static uploadMet(req:any, res:express.Response, next:express.NextFunction){
        console.log("Uploading");
        UploadM.upload(req, res, function (err:any) {
            if (err) {
                console.log(err);
                res.status(400).json({message: err.message});
            } else {
                //next();
                console.log('success');
                res.status(200).json({path:req.file.filename})
            }
        })
    }

    static getMet(req:express.Request, res:express.Response, next:express.NextFunction){
        // if(req.params.length>0){
        //     let imagename = req.params.imagename;
        //     if(imagename != null && imagename != undefined && imagename.trim()!=''){
        //         let imagepath = __dirname + "/../../public/images/" + imagename;
        //         let image = fs.readFileSync(imagepath);
        //         let mime = fileType(image).mime;
            
        //         res.writeHead(200, {'Content-Type': mime })
        //         res.end(image, 'binary');
        //     }
        // }
        //  else{
        //     res.status(404).send();
        // }
        let imagename = req.params.imagename;
        if(imagename != null && imagename != undefined && imagename.trim()!=''){
            let imagepath = __dirname + "/../../public/images/" + imagename;
            let image = fs.readFileSync(imagepath);
            let mime = fileType(image).mime;
        
            res.writeHead(200, {'Content-Type': mime })
            res.end(image, 'binary');
        }
        
    }
}