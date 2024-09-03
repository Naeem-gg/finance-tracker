import {defineConfig} from "drizzle-kit"
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});
export default defineConfig({
    dialect:"sqlite",
    driver:"turso",
    schema:"./drizzle/schema.ts",
    out:"./drizzle/migrations",
    strict:true,
    verbose:true,

 dbCredentials:{
    url: process.env.DATABASE_URL as string, authToken: process.env.DATABASE_TOKEN as string
 }   
})