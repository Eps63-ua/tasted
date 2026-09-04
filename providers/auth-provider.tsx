import type { Session,User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { createContext,PropsWithChildren,useCallback,useContext,useEffect,useMemo,useState } from 'react';
import { isSupabaseMode } from '@/lib/env';
import { supabase } from '@/lib/supabase';

type AuthStatus='loading'|'authenticated'|'unauthenticated';
type AuthApi={status:AuthStatus;session:Session|null;user:User|null;isSupabase:boolean;signIn(email:string,password:string):Promise<void>;signUp(email:string,password:string,displayName:string,username:string):Promise<boolean>;requestPasswordReset(email:string):Promise<void>;updatePassword(password:string):Promise<void>;signOut():Promise<void>};
const Context=createContext<AuthApi|null>(null);
export function AuthProvider({children}:PropsWithChildren){
  const [session,setSession]=useState<Session|null>(null);const [status,setStatus]=useState<AuthStatus>(isSupabaseMode?'loading':'authenticated');
  useEffect(()=>{if(!isSupabaseMode)return;let active=true;void supabase.auth.getSession().then(({data,error})=>{if(!active)return;if(error){setStatus('unauthenticated');return}setSession(data.session);setStatus(data.session?'authenticated':'unauthenticated')});const {data:{subscription}}=supabase.auth.onAuthStateChange((event,next)=>{setSession(next);setStatus(event==='PASSWORD_RECOVERY'?'unauthenticated':next?'authenticated':'unauthenticated');if(event==='PASSWORD_RECOVERY')router.replace('/reset-password')});return()=>{active=false;subscription.unsubscribe()}},[]);
  const signIn=useCallback(async(email:string,password:string)=>{const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error},[]);
  const signUp=useCallback(async(email:string,password:string,displayName:string,username:string)=>{const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{display_name:displayName.trim(),username:username.trim().toLowerCase()}}});if(error)throw error;return !data.session},[]);
  const requestPasswordReset=useCallback(async(email:string)=>{const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:Linking.createURL('/reset-password')});if(error)throw error},[]);
  const updatePassword=useCallback(async(password:string)=>{const {error}=await supabase.auth.updateUser({password});if(error)throw error;setStatus('authenticated')},[]);
  const signOut=useCallback(async()=>{if(!isSupabaseMode)return;const {error}=await supabase.auth.signOut();if(error)throw error},[]);
  const value=useMemo<AuthApi>(()=>({status,session,user:session?.user??null,isSupabase:isSupabaseMode,signIn,signUp,requestPasswordReset,updatePassword,signOut}),[status,session,signIn,signUp,requestPasswordReset,updatePassword,signOut]);return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAuth(){const value=useContext(Context);if(!value)throw new Error('useAuth requiere AuthProvider');return value}
