import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Users, Wrench, DollarSign, Search } from 'lucide-react';

export default function Financeiro(){
const [clientes,setClientes]=useState([]); const [servicos,setServicos]=useState([]);
const [nome,setNome]=useState(''); const [contato,setContato]=useState('');
const [clienteId,setClienteId]=useState(''); const [desc,setDesc]=useState(''); const [valor,setValor]=useState('');
const [busca,setBusca]=useState('');
useEffect(()=>{const c=localStorage.getItem('clientes_v2');const s=localStorage.getItem('servicos_v2');if(c) setClientes(JSON.parse(c));if(s) setServicos(JSON.parse(s));},[]);
useEffect(()=>{localStorage.setItem('clientes_v2',JSON.stringify(clientes));localStorage.setItem('servicos_v2',JSON.stringify(servicos));},[clientes,servicos]);
const addCliente=()=>{if(!nome.trim()) return;setClientes([...clientes,{id:Date.now()+'' ,nome,contato}]);setNome('');setContato('');};
const addServico=()=>{if(!clienteId||!desc||!valor) return;setServicos([{id:Date.now()+'',clienteId,desc,valor:Number(valor),data:new Date().toLocaleDateString('pt-BR')},...servicos]);setDesc('');setValor('');};
const delCliente=id=>{setClientes(clientes.filter(c=>c.id!==id));setServicos(servicos.filter(s=>s.clienteId!==id));};
const delServico=id=>setServicos(servicos.filter(s=>s.id!==id));
const total=useMemo(()=>servicos.reduce((a,b)=>a+b.valor,0),[servicos]);
const porCliente=id=>servicos.filter(s=>s.clienteId===id).reduce((a,b)=>a+b.valor,0);
const clientesFiltrados=clientes.filter(c=>c.nome.toLowerCase().includes(busca.toLowerCase()));
return <div className='min-h-screen bg-slate-100 p-4 md:p-8'>
<div className='max-w-7xl mx-auto space-y-6'>
<h1 className='text-4xl font-bold'>Financeiro Pro</h1>
<div className='grid md:grid-cols-4 gap-4'>
<Card className='rounded-2xl'><CardContent className='p-4 flex items-center gap-3'><Users/><div><div className='text-sm text-muted-foreground'>Clientes</div><div className='text-2xl font-bold'>{clientes.length}</div></div></CardContent></Card>
<Card className='rounded-2xl'><CardContent className='p-4 flex items-center gap-3'><Wrench/><div><div className='text-sm text-muted-foreground'>Serviços</div><div className='text-2xl font-bold'>{servicos.length}</div></div></CardContent></Card>
<Card className='rounded-2xl md:col-span-2'><CardContent className='p-4 flex items-center gap-3'><DollarSign/><div><div className='text-sm text-muted-foreground'>Faturamento</div><div className='text-2xl font-bold'>R$ {total.toFixed(2)}</div></div></CardContent></Card>
</div>
<div className='grid lg:grid-cols-3 gap-6'>
<Card className='rounded-2xl'><CardContent className='p-4 space-y-3'><h2 className='font-semibold'>Novo Cliente</h2><Input placeholder='Nome' value={nome} onChange={e=>setNome(e.target.value)}/><Input placeholder='Contato' value={contato} onChange={e=>setContato(e.target.value)}/><Button className='w-full' onClick={addCliente}>Adicionar Cliente</Button></CardContent></Card>
<Card className='rounded-2xl lg:col-span-2'><CardContent className='p-4 space-y-3'><h2 className='font-semibold'>Novo Serviço</h2><select className='w-full border rounded-md p-2' value={clienteId} onChange={e=>setClienteId(e.target.value)}><option value=''>Selecione</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select><Input placeholder='Descrição do serviço' value={desc} onChange={e=>setDesc(e.target.value)}/><Input placeholder='Valor' type='number' value={valor} onChange={e=>setValor(e.target.value)}/><Button className='w-full' onClick={addServico}>Registrar Serviço</Button></CardContent></Card>
</div>
<div className='grid lg:grid-cols-2 gap-6'>
<Card className='rounded-2xl'><CardContent className='p-4 space-y-4'><div className='flex items-center gap-2'><Search size={18}/><Input placeholder='Buscar cliente...' value={busca} onChange={e=>setBusca(e.target.value)}/></div><h2 className='font-semibold'>Clientes</h2>{clientesFiltrados.map(c=><div key={c.id} className='flex justify-between items-center border rounded-xl p-3'><div><div className='font-medium'>{c.nome}</div><div className='text-sm text-muted-foreground'>{c.contato}</div><div className='text-sm font-semibold'>Total: R$ {porCliente(c.id).toFixed(2)}</div></div><Button variant='ghost' size='icon' onClick={()=>delCliente(c.id)}><Trash2 size={18}/></Button></div>)}</CardContent></Card>
<Card className='rounded-2xl'><CardContent className='p-4 space-y-3'><h2 className='font-semibold'>Histórico</h2>{servicos.map(s=>{const c=clientes.find(x=>x.id===s.clienteId);return <div key={s.id} className='border rounded-xl p-3 flex justify-between items-center'><div><div className='font-medium'>{c?.nome||'Cliente removido'}</div><div className='text-sm'>{s.desc} • {s.data}</div><div className='font-semibold'>R$ {s.valor.toFixed(2)}</div></div><Button variant='ghost' size='icon' onClick={()=>delServico(s.id)}><Trash2 size={18}/></Button></div>})}</CardContent></Card>
</div>
<div className='grid md:grid-cols-3 gap-4'>
<Card className='rounded-2xl'><CardContent className='p-4'><h3 className='font-semibold mb-2'>Resumo</h3><p className='text-sm text-muted-foreground'>Controle completo de clientes, serviços e faturamento.</p></CardContent></Card>
<Card className='rounded-2xl'><CardContent className='p-4'><h3 className='font-semibold mb-2'>Pendências</h3><p className='text-sm text-muted-foreground'>Em breve: contas a receber, vencimentos e lembretes.</p></CardContent></Card>
<Card className='rounded-2xl'><CardContent className='p-4'><h3 className='font-semibold mb-2'>Backup</h3><Button className='w-full' onClick={()=>{const data=JSON.stringify({clientes,servicos});navigator.clipboard.writeText(data);}}>Copiar Backup</Button></CardContent></Card>
</div>
</div></div>
}
