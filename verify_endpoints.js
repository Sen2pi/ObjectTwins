const BASE_URL = 'http://localhost:8080';

async function testEndpoint(name, method, url, body = null) {
  console.log(`\n### Teste: ${name}`);
  console.log(`- **URL**: \`${url}\``);
  console.log(`- **Método**: ${method}`);
  
  try {
    const options = { method };
    if (body) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body);
      console.log(`- **Payload**: \n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\``);
    }

    const start = Date.now();
    const res = await fetch(BASE_URL + url, options);
    const duration = Date.now() - start;
    
    console.log(`- **Status**: ${res.status} ${res.statusText}`);
    console.log(`- **Duração**: ${duration}ms`);

    const contentType = res.headers.get('content-type');
    let output;
    if (contentType && contentType.includes('application/json')) {
      const json = await res.json();
      output = JSON.stringify(json, null, 2);
    } else {
      output = await res.text();
      // Truncate long HTML for readability in MD
      if (output.length > 500) output = output.substring(0, 500) + '... (truncated)';
    }
    
    console.log(`- **Resposta**: \n\`\`\`${contentType && contentType.includes('json') ? 'json' : 'html'}\n${output}\n\`\`\``);
    return true;
  } catch (err) {
    console.log(`- **Erro**: ${err.message}`);
    return false;
  }
}

async function runTests() {
  console.log('# Relatório de Testes de Integração com Inven!RA');
  console.log(`Data: ${new Date().toISOString()}\n`);

  // 1. Config
  await testEndpoint('Obter Configuração (Inven!RA)', 'GET', '/config');

  // 2. Params
  await testEndpoint('Obter Parâmetros JSON', 'GET', '/json-params');

  // 3. Analytics List
  await testEndpoint('Obter Catálogo de Analíticas', 'GET', '/analytics-list');

  // 4. Deploy (Standard)
  await testEndpoint('Deploy da Atividade (Padrão)', 'GET', '/deploy?activityID=test_std&gravity=9.8');

  // 5. Deploy (With Collision Decorator)
  await testEndpoint('Deploy da Atividade (Com Colisões)', 'GET', '/deploy?activityID=test_col&record_collision_events=true');

  // 6. Analytics (Standard)
  await testEndpoint('Obter Analíticas (Atividade Padrão)', 'POST', '/analytics', { activityID: 'test_std' });

  // 7. Analytics (With Collision)
  await testEndpoint('Obter Analíticas (Atividade com Colisões)', 'POST', '/analytics', { activityID: 'test_col' });
}

runTests();
