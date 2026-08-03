import { Tabs } from 'expo-router';
import { Home, Search, PlusCircle, User } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@/constants/theme';

export default function TabLayout() { return <Tabs screenOptions={{ headerShown:false, tabBarActiveTintColor:colors.accent, tabBarInactiveTintColor:colors.textSecondary, tabBarStyle:styles.bar, tabBarLabelStyle:styles.label, tabBarHideOnKeyboard:true }}><Tabs.Screen name="index" options={{title:'Inicio',tabBarIcon:({color,size})=><Home color={color} size={size}/>}}/><Tabs.Screen name="search" options={{title:'Buscar',tabBarIcon:({color,size})=><Search color={color} size={size}/>}}/><Tabs.Screen name="create" options={{title:'Crear',tabBarIcon:({color,size})=><PlusCircle color={color} size={size}/>}}/><Tabs.Screen name="profile" options={{title:'Perfil',tabBarIcon:({color,size})=><User color={color} size={size}/>}}/></Tabs>; }
const styles=StyleSheet.create({bar:{height:68,backgroundColor:colors.surfaceNavigation,borderTopColor:colors.border,paddingTop:spacing[8]},label:{fontSize:fontSizes.tabLabel,marginBottom:spacing[4]},});
