import express, { response } from'express';
import { request } from 'http';
import { createConnection } from './index.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router= express.Router();

router.post("/signup", async(request, response)=>{
  try{
    const {username, password} = request.body;

    console.log(username, password);

    const hashedPassword = await generatePassword(password);
    console.log(hashedPassword);
    const client = await createConnection();

    const userFromDB= await getUserByName(client, username);
console.log(userFromDB);


const storedPassword= userFromDB.password;
const isPasswordMatch= await bcrypt.compare(password, storedPassword);

if(isPasswordMatch){
  
  const token= jwt.sign({id:userFromDB._id}, process.env.SECRET_KEY);
  response.send({message:"Successfull login", token: token});
}else{
  response.send({message:"Invalid credentials"});
}
var pattern = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).+$");
  if(password.length<8){
    response.status(400).send({message:"Password is too short"});
    return;
  }else if( pattern.test(password)){
  
     const result= await createUser(client, {username, password: hashedPassword});
   
      response.send(result);
      return;
  }else{
    response.status(400).send({message:"Given password is weak, please give strong password"});
    return;
  }
  }catch(err){
    console.log(err);



  }
}
);




export const usersRouter=router;

async function generatePassword(password) {
  const no_of_rounds = 10;
  const salt = await bcrypt.genSalt(no_of_rounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
async function createUser(client, data) {
  return await client
    .db("googleDrive-clone")
    .collection("users")
    .insertOne(data);
}
async function getUserByName(client, username) {
  return await client
    .db("googleDrive-clone")
    .collection("users")
    .findOne({ username: username });
}