const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const baseData = path.join(__dirname, '..', 'public', 'data');
const baseSchemas = path.join(__dirname, '..', 'schemas');
function loadJson(p){
  return JSON.parse(fs.readFileSync(path.join(baseData, p), 'utf8'));
}
function loadSchema(p){
  return JSON.parse(fs.readFileSync(path.join(baseSchemas, p), 'utf8'));
}

async function main(){
  const ajv = new Ajv({allErrors:true});
  try{
    require('ajv-formats')(ajv);
  }catch(e){
    // fallback: continue without formats if ajv-formats is not available
  }
  const temas = loadJson('temas.json');
  const chapas = loadJson('chapas.json');
  const perfis = loadJson('perfis.json');
  const propostas = loadJson('propostas.json');

  const temaSchema = loadSchema('tema.schema.json');
  const chapaSchema = loadSchema('chapa.schema.json');
  const perfilSchema = loadSchema('perfil.schema.json');
  const propostaSchema = loadSchema('proposta.schema.json');

  const vTema = ajv.compile(temaSchema);
  const vChapa = ajv.compile(chapaSchema);
  const vPerfil = ajv.compile(perfilSchema);
  const vProposta = ajv.compile(propostaSchema);

  let hasError = false;
  temas.forEach((t,i)=>{ if(!vTema(t)){ console.error('temas.json', i, vTema.errors); hasError = true }});
  chapas.forEach((c,i)=>{ if(!vChapa(c)){ console.error('chapas.json', i, vChapa.errors); hasError = true }});
  perfis.forEach((p,i)=>{ if(!vPerfil(p)){ console.error('perfis.json', i, vPerfil.errors); hasError = true }});
  propostas.forEach((p,i)=>{ if(!vProposta(p)){ console.error('propostas.json', i, vProposta.errors); hasError = true }});

  // Referential checks
  const temaIds = new Set(temas.map(t=>t.id));
  const chapaIds = new Set(chapas.map(c=>c.id));
  const perfilIds = new Set(perfis.map(p=>p.id));

  propostas.forEach((p,i)=>{
    if(!temaIds.has(p.temaId)){ console.error('propostas.json referential temaId missing:', p.temaId); hasError = true }
    if(!chapaIds.has(p.chapaId)){ console.error('propostas.json referential chapaId missing:', p.chapaId); hasError = true }
  });

  chapas.forEach((c)=>{
    if(!perfilIds.has(c.presidenteId)) { console.error('chapas.json presidenteId missing:', c.presidenteId); hasError = true }
    if(!perfilIds.has(c.viceId)) { console.error('chapas.json viceId missing:', c.viceId); hasError = true }
  });

  if(hasError){
    console.error('Validação falhou. Corrija os erros acima.');
    process.exit(2);
  }
  console.log('Validação concluída: sem erros detectados.');
}

main().catch(err=>{ console.error(err); process.exit(1) });
