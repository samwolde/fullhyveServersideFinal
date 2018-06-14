import * as express from "express";
import * as jwt from "jsonwebtoken";
import {DB} from "../models/db/db";
import {AuthConst} from "../models/constants/constant";
import { decode } from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import { resolve } from "dns";

//import * as bodyParser from "body-parser";

export class Authentication{
    static createToken(req:any, callback:any){
        console.log("working now");
        let userName = req.validData.userName;
        let password = req.validData.password;

        console.log('p2');
        DB.User.findOne({
            where:{
                userName:userName
            }
        }).then((user:any)=>{
            if(user){
                bcrypt.compare(password, user.password, (err, result)=>{
                    if(result){
						let payload = {
                            userId:user.id
                        };
        
                        let token = jwt.sign(payload, AuthConst.SECRET,{
                            expiresIn:"1d",
                        });
                        //res.setHeader("Authorization",`Bearer ${token}`);
                        
                        let resp = {
                            token:token
                        }
                        
                        DB.UserLog.create({
                            userId:user.id
                        });

                        callback({success:true, code:200, message:"Successfully logged-in",data: resp});
					} else{
                        callback({success:false, code:401, message:"Incorrect username and/or password",data: null});
					}
                });
                
            } else{
                callback({success:false, code:401, message:"Incorrect username and/or password",data: null});
            }
            console.log("p1");
        }).catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static verifyToken(req:any, res:express.Response, next:express.NextFunction){
        if(req.headers.hasOwnProperty('authorization')){
            let token = req.header('Authorization').split(' ')[1];
            
            jwt.verify(token, AuthConst.SECRET, (err:any, decoded:any)=>{
                if(err){
                    res.status(403).send();
                } else{
                    req.thisUser = {};
                    req.thisUser.id = decoded.userId;
                    next();
                }
                
            });
        } else{
            res.status(200).send();
        }
    }

    static hashPassword(password:string):Promise<any>{
        return new Promise((resolve, reject)=>{
            bcrypt.hash(password, 10, (err, hash)=>{
                if(err){
                    resolve();
                } else{
                    resolve(hash);
                }
            });
        })
        
    }

    static verifyTokenReal(token:string){
        return new Promise((resolve, reject)=>{
            // let tokens:string[] = token.split(' ');
            
            // if(tokens.length <= 1){
            //     resolve();
            // }

            // token = tokens[1];
            
            jwt.verify(token, AuthConst.SECRET, (err:any, decoded:any)=>{
                console.log(err);
                if(err){
                    resolve();
                } else{
                    resolve({thisUser:{id:decoded.userId}});
                }
                
            });
        })
        
    }
}


