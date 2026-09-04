import { supabase } from '@/lib/supabase';
type Bucket='avatars'|'establishment-images'|'product-images'|'category-images';
const remote=(uri:string)=>/^https?:\/\//.test(uri);const extension=(uri:string)=>uri.split('?')[0].split('.').pop()?.toLowerCase()||'jpg';
export class StorageService{
  async upload(userId:string,bucket:Bucket,type:string,entityId:string,uri:string){if(remote(uri))return uri;const ext=extension(uri);const path=`${userId}/${type}/${entityId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;const response=await fetch(uri);if(!response.ok)throw new Error('No se pudo leer la imagen seleccionada.');const buffer=await response.arrayBuffer();const contentType=ext==='png'?'image/png':ext==='webp'?'image/webp':'image/jpeg';const {error}=await supabase.storage.from(bucket).upload(path,buffer,{contentType,upsert:false});if(error)throw new Error(`No se pudo subir la imagen: ${error.message}`);return path}
  publicUrl(bucket:Bucket,path:string){if(remote(path))return path;return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl}
  async remove(bucket:Bucket,paths:string[]){const stored=paths.filter(p=>!remote(p));if(!stored.length)return;const {error}=await supabase.storage.from(bucket).remove(stored);if(error)throw new Error(`No se pudo eliminar la imagen: ${error.message}`)}
}
export const storageService=new StorageService();
