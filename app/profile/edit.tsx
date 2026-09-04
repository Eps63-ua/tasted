import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller,useForm } from 'react-hook-form';
import { StyleSheet,View } from 'react-native';
import { z } from 'zod';
import { AppHeader,Button,Field,ImagePickerField,Screen } from '@/components/ui/app-ui';
import { spacing } from '@/constants/theme';
import { useAppData } from '@/providers/app-data-provider';

const schema=z.object({displayName:z.string().trim().min(1,'Escribe tu nombre'),username:z.string().trim().min(2,'Mínimo dos caracteres'),email:z.email('Correo no válido'),bio:z.string(),avatarUri:z.string()});type Values=z.infer<typeof schema>;
export default function Page(){const {data,saveProfile,isSupabase}=useAppData();const p=data?.profile;const {control,handleSubmit,formState:{errors,isSubmitting}}=useForm<Values>({resolver:zodResolver(schema),values:{displayName:p?.displayName??'',username:p?.username??'',email:p?.email??'',bio:p?.bio??'',avatarUri:p?.avatarUri??''}});if(!p)return null;return <Screen><AppHeader title="Editar perfil" back/><View style={styles.form}><Controller control={control} name="avatarUri" render={({field})=><ImagePickerField images={field.value?[field.value]:[]} onChange={x=>field.onChange(x[0]??'')}/>}/><Controller control={control} name="displayName" render={({field})=><Field label="Nombre" value={field.value} onChangeText={field.onChange} error={errors.displayName?.message}/>}/><Controller control={control} name="username" render={({field})=><Field label="Usuario" autoCapitalize="none" value={field.value} onChangeText={field.onChange} error={errors.username?.message}/>}/><Controller control={control} name="email" render={({field})=><Field label={isSupabase?'Correo (gestionado por Supabase Auth)':'Correo'} editable={!isSupabase} keyboardType="email-address" autoCapitalize="none" value={field.value} onChangeText={field.onChange} error={errors.email?.message}/>}/><Controller control={control} name="bio" render={({field})=><Field label="Biografía" multiline value={field.value} onChangeText={field.onChange}/>}/><Button title={isSubmitting?'Guardando…':'Guardar perfil'} disabled={isSubmitting} onPress={handleSubmit(async v=>{await saveProfile(v);router.back()})}/></View></Screen>}
const styles=StyleSheet.create({form:{gap:spacing[16]}});
