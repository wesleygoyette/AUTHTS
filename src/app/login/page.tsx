"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, signIn, confirmSignIn } from "@aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import awsconfig from '@/aws-exports';

Amplify.configure(awsconfig, { ssr: true });

const Login = () => {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{

    fetchAuthSession().then(sesh => {
    
        if(sesh.tokens != undefined){
            router.push("/");
        }
    }).catch(e => {});
  }, [router]);

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    console.log('Logging in with:', { email, password });

    try {

        const out = await signIn({

            username: email,
            password: password,
        });

        console.log(out);

        router.push("/");
        
    } catch (error) {
        
      if(error == "UserNotFoundException: User does not exist." || error == "NotAuthorizedException: Incorrect username or password."){

        alert("We didn’t find an account with those login credentials");
      }
      else if(error == "UserAlreadyAuthenticatedException: There is already a signed in user."){

        router.push("/");
      }
      else{

        console.log(error);
      }

    }
  };

  return (
    <div className="w-screen h-screen fixed flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className=" bg-[rgb(241,246,251)] w-[95%] max-w-[576px] flex flex-col gap-[22px] p-[84px]">
        <div>
          <h1 className="text-[21px] font-[600]">Login</h1>
          <h3 className="text-[11px] font-[400] text-gray-600">Habit Story is brought to you by Two Story.</h3>
        </div>

        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[11px] font-[400] text-gray-600">Email Address</h1>
          <input className="w-full h-[32px] px-[10px] border text-[16px] text-[rgb(107,107,107)]" type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
        </div>

        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[11px] font-[400] text-gray-600">Password</h1>
          <input className="w-full h-[32px] px-[10px] border " type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        </div>

        <button className="bg-[rgb(50,78,111)] h-[48px] text-[14px] font-[600] text-white mt-[32px] active:opacity-50 hover:opacity-75">Login</button>
      </form>
    </div>
  )
}

export default Login;