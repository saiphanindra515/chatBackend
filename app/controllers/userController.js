const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib');
const passwordCheck = require('./../libs/passwordlib')
const token=require('./../libs/token')

/* Models */
const UserModel = mongoose.model('User')
const AuthModel=mongoose.model('Auth');

// start user signup function 

let signUpFunction = (req, res) => {

    let validateinput =()=>{
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                if(!validateInput.Email(req.body.email)){
                 logger.error('not a valid email','error occured at validateinput method',6);
                 let apiResponse = response.generate(`Error occured:${err}`,'entered email is not in the format prefered',400,null);
                 reject(apiResponse)   
                }else if(check.isEmpty(req.body.password)){
                    logger.error('password is empty','error at validateinput:password',0);
                    let apiResponse = response.generate(`Error occured:${err}`,'password is empty',400,null);
                    reject(apiResponse)   
                }else{
                    resolve(req)
                }

                }
            else{
                logger.error(err,'email not found',0);
                let apiResponse = response.generate(`Error occured:${err}`,'enter email',400,null);
                reject(apiResponse)
            }
        })
    }//end of validateinput
      let createUser = ()=>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({'email':req.body.email},(err,userDetails)=>{
               if(err){
                logger.error(err,'error at createUser:password',0);
                let apiResponse = response.generate(`Error occured:${err}`,'',400,null);
                reject(apiResponse)   
               }else if(check.isEmpty(userDetails)){
                   let user = new UserModel({
                       userId:shortid.generate(),
                       firstName:req.body.firstName,
                       lastName:req.body.lastName,
                       password:passwordCheck.hashpassword(req.body.password),
                       email:req.body.email,
                       mobileNumber:req.body.mobileNumber,
                       created:time.now()
                   })
                  user.save((err,result)=>{
                      if(err){
                        logger.error(err,'failed to create user',0);
                        let apiResponse = response.generate(`Error occured:${err}`,'failed to create user',400,null);
                        reject(apiResponse)   
                      }else{
                        logger.error(err,'user created',0);
                        newobt = user.toObject();
                        resolve(newobt);
                        
                      }
                  }) 
               }else{
                   logger.error('email is already registered','validate email',4);
                   let apiResponse =response.generate(true,"email is already exist",400,null);
                   res.send(apiResponse);
               }
            })
        })
      }//end of creater user
    
    

    validateinput(req,res)
    .then(createUser)
    .then((resolve)=>{
      delete resolve.password;
      
           let apiResponse = response.generate(false,'user created',400,resolve);
           res.send(apiResponse)
             
    })
   .catch((err)=>{
       console.log(err); 
       res.send(err);
   })
 

}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {

    validateEmail = () =>{
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                UserModel.findOne({'email':req.body.email}).exec((err,userDetails)=>{
                    if(err){
                     logger.error(err,'some error occured',0);
                     let apiResponse = response.generate(`Error occured:${err}`,'error occured',400,null);
                     reject(apiResponse)   
                    }else if(check.isEmpty(userDetails)){
                     logger.error(err,'email is not registered',0);
                     let apiResponse = response.generate(`Error occured:${err}`,'Email not registered to login',400,null);
                     reject(apiResponse)   
                    }
                     else{
                         resolve(userDetails);
                     }
     
                })//end of find
     
             }//if ends
             else{
                 logger.error(err,'no mail',0);
                  let apiResponse = response.generate(`Error occured:${err}`,'enter email',400,null);
                  reject(apiResponse)   
                }

        })
        
        
    }//validateEmail ends here
      

     validatePassword = (retrievedUserDetails)=>
     {
        return new Promise((resolve,reject)=>{
            if(req.body.password){
            passwordCheck.comparePassword(req.body.password,retrievedUserDetails.password,(err,isMatch)=>{
              if(err){
                logger.error(err,'password is incorrect',0);
                let apiResponse = response.generate(`Error occured:${err}`,'password is incorrect',400,null);
                reject(apiResponse) 
              }else if(isMatch){
                    
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
              }
            })
        }
        else{
            logger.error(err,'password not found',0);
            let apiResponse = response.generate(`Error occured:${err}`,'password not found',400,null);
             reject(apiResponse)   
        }
        })
        
    
    }//validate password
     let gen = (userDetails)=>{
         return new Promise((resolve,reject)=>{
            token.generateToken(userDetails,(err,tokendetails)=>{
                if(err){
                  logger.error(err,'jwt token is not generated',0);
                  let apiResponse = response.generate(`Error occured:${err}`,'error in token generation',400,null);
                   reject(apiResponse)
                }else{
                    tokendetails.id = userDetails.userId;
                    tokendetails.userdetails=userDetails;
                    resolve(tokendetails);
                }
            })
         })
     }
     let savetoken = (retreivedtoken)=>{
        
             AuthModel.findOne({'userId':retreivedtoken.id},(err,userDetail)=>{
                 if(err){
                    logger.error(err,'some occured at svaetoke,findone',0);
                    let apiResponse = response.generate(`Error occured:${err}`,'error in save token',400,null);
                     reject(apiResponse)
                 }
                   else if(check.isEmpty(userDetail))
                   {
                    let newAuth = new AuthModel({
                    userId: retreivedtoken.userId,
                    authToken: retrieved.token,
                    tokenSecret: retrieved.tokenSecret,
                    tokenGenerationTime: time.now()
                     })
                       newAuth.save((err,result)=>
                       {
                        if(err)
                        {
                         console.log(err)
                        logger.error(err.message, 'userController: saveToken', 10)
                        let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                        reject(apiResponse)
                       }else{
                        let responseBody = {
                            authToken: userDetail.authToken,
                            userDetails: retreivedtoken.userDetails
                        }
                        resolve(responseBody)
                       }
                   })
                 }else{
                    userDetail.authToken = tokenDetails.token
                    userDetail.tokenSecret = tokenDetails.tokenSecret
                    userDetail.tokenGenerationTime = time.now()
                     userDetail.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                  
                            resolve(responseBody)
                        }
                 
             })

            }
        }) 
            
    
    
} 
    

   
    validateEmail(req,res)
    .then(validatePassword)
    .then(gen)
    .then((resolve)=>{
       
       let apiResponse = response.generate(false,'login successfull',400,resolve);
       res.send(apiResponse) 
    })
   .catch((err)=>{
       console.log(err);
       res.send(err);
   })

    
  }//login function ends here


// end of the login function 


let logout = (req, res) => {
  
} // end of the logout function.


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout

}// end exports