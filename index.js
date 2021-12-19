import { response } from "express";
import { request } from "http";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import cors from'cors';
import { MongoClient } from "mongodb";
import { usersRouter } from "./users.js";

const express=require("express");
const app=express();

app.use(express.json());
app.use(cors());
export const MONGO_URL=process.env.MONGO_URL;

export async function createConnection(){
const client= new MongoClient(MONGO_URL);
await client.connect();
console.log("MongoDB Connected!!!");
return client;
}


app.get("/", (request, response)=>{
  response.send("Hello world!!!!");
});

const moviesPORT= process.env.PORT||6000;

app.use("/users", usersRouter);

app.listen(moviesPORT, ()=>{
  console.log("app is started with PORT "+moviesPORT);
});