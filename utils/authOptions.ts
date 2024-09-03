import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
export const authOptions = {
    providers:[
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            type:"credentials",
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              email: { label: "Email", type: "email", placeholder: "email" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{
              // Add logic here to look up the user from the credentials supplied
              const user = await db.query.users.findFirst({where:eq(users.email,credentials.email)})
              if(!user){
                throw new Error("Invalid email")
              }
              const passCheck = await bcrypt.compare(credentials.password,user?.password??"")
              if (!passCheck) {
                throw new Error("Invalid Password")
              
              }
              return user
               
                // If you return null then an error will be displayed advising the user to check their details.
               
        
                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
              
            }
          })
    ],
    secret:process.env.NEXTAUTH_SECRET,
    theme:{brandColor:'#000fff',colorScheme:"auto"},
    pages:{
        signIn:'/login'
        
    },
    // logger:{warn:t}
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

} satisfies AuthOptions